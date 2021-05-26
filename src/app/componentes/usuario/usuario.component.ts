import { Component, ViewChild } from '@angular/core';
import { Eopciones } from '../../utils/Egeneral.enum';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTable, MatTableDataSource } from '@angular/material';
import { EnumTipoMensaje, IDatosMensajes, IDatosPopup, ITarjetaUsuario, ITipoFranquicia, ITipoIdentificacion, IUsuario } from '../../models/IUsuario';
import { EendPoint } from '../../utils/EendPoins.enum';
import { ConexionServicioApiService } from '../../services/conexion-servicio-api.service';
import { isNullOrUndefined } from 'util';
import { MensajeComponent } from '../../componentes/mensaje/mensaje.component';
import { UsuarioTarjetaComponent } from './usuario-tarjeta/usuario-tarjeta.component';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {

  columnas: string[] = ['nombreUsuario', 'apellidoUsuario', 'identificacionUsuario', 'TipIdentificacionUsuario','buscar'];
  datosConsultados: MatTableDataSource<IUsuario>;

  public opciones = Eopciones;
  public opcionSeleccionada: number = this.opciones.Agregar;
  public formUsuario: FormGroup;
  public idsSeleccionados: Array<number> = [];
  public cargando: boolean = true;
  public listTipIdentificacion: Array<ITipoIdentificacion>;
  public listTipFranquiciaTarjeta: Array<ITipoFranquicia>;
  public valorId: number;
  public datosPopup: IDatosPopup;

  @ViewChild(MatPaginator, {static: false}) paginador: MatPaginator;
  @ViewChild(MatSort, { static: false}) ordenador: MatSort;
  @ViewChild('tablaDatos', { static: false}) tablaDatos: MatTable<IUsuario>;

  constructor(private conexionServicio: ConexionServicioApiService, private sMensaje: MatDialog) {
    this.formUsuario = new FormGroup({
      id: new FormControl(),
      nombreUsuario: new FormControl(''),
      apellidoUsuario: new FormControl(''),
      identificacionUsuario: new FormControl(''),
      tipoIdentificacion: new FormControl('')     
    });    
  }

  async ngOnInit() {
    this.CargarDatosTipoIdentificacion();    
    this.AjustarValidaciones();
  }

  private AjustarValidaciones(_datos: IUsuario = { nombreUsuario: null, apellidoUsuario: null, identificacionUsuario: null, tipoIdentificacion: null }): void {
    
    if(_datos.tipoIdentificacion !=null){
      this.formUsuario.reset({
        id: _datos.id,
        nombreUsuario: _datos.nombreUsuario,
        apellidoUsuario: _datos.apellidoUsuario,
        identificacionUsuario: _datos.identificacionUsuario,
        tipoIdentificacion: _datos.tipoIdentificacion.id 
      });

      this.formUsuario.controls.identificacionUsuario.disable();
      this.formUsuario.controls.tipoIdentificacion.disable();

    }else{
    this.formUsuario.reset({
      nombreUsuario: _datos.nombreUsuario,
      apellidoUsuario: _datos.apellidoUsuario,
      identificacionUsuario: _datos.identificacionUsuario,
      tipoIdentificacion: _datos.tipoIdentificacion     
    });

    this.formUsuario.controls.identificacionUsuario.enable();
      this.formUsuario.controls.tipoIdentificacion.enable();
  }
    
    this.cargando = false;

  }

  public EjecutarOperacion() {

    try {
      switch (this.opcionSeleccionada) {
        case this.opciones.Agregar:
          this.AgregarRegistro();
          break;
        case this.opciones.Buscar:
          this.CargarDatos();
          break;
        case this.opciones.Editar:
          this.EditarRegistro();
          break;
      }
    } catch (_error) {
      this.MostrarMensaje(new IDatosMensajes('Error', _error, EnumTipoMensaje.error));
    }
  }

  private AgregarRegistro() {

     let objetousuario ={
       "nombreUsuario" : this.formUsuario.controls.nombreUsuario.value,
       "apellidoUsuario" : this.formUsuario.controls.apellidoUsuario.value,
       "identificacionUsuario" : this.formUsuario.controls.identificacionUsuario.value,
       "tipoIdentificacion" : {
         "id" : this.formUsuario.controls.tipoIdentificacion.value,
       }
      }    

    this.conexionServicio.Crear<IUsuario>(EendPoint.usuario, objetousuario)
      .then(_registro => {
        if (this.datosCargados) {
          this.datosConsultados.data.push(_registro.datos);          
          this.CargarDatosIngreso();
        } else {
          this.CambiarOpcion(0);
        }
        this.MostrarMensaje(new IDatosMensajes('Resultado registro', _registro.mensaje));

      }
        , _error => {
          this.MostrarMensaje(new IDatosMensajes('Error en registro', _error, EnumTipoMensaje.error));
        });
  }

   private CargarDatos(): void {

     this.conexionServicio.Consultar<IUsuario>(EendPoint.usuario, this.formUsuario.value)
       .then(_registros => {
         this.ActualizarDataSource(_registros.datos);         
       }
         , (_error) => {
           this.MostrarMensaje(new IDatosMensajes('Error en consulta', _error, EnumTipoMensaje.error));
         });
  }

  private CargarDatosIngreso(): void {

    let objetousuario ={
      "nombreUsuario" : null,
      "apellidoUsuario" : null,
      "identificacionUsuario" : null,
      "tipoIdentificacion" : null
     }  

    this.conexionServicio.Consultar<IUsuario>(EendPoint.usuario, objetousuario)
      .then(_registros => {
        this.ActualizarDataSource(_registros.datos);         
      }
        , (_error) => {
          this.MostrarMensaje(new IDatosMensajes('Error en consulta', _error, EnumTipoMensaje.error));
        });
 }

  private EditarRegistro() {

    let objetousuario ={
      "nombreUsuario" : this.formUsuario.controls.nombreUsuario.value,
      "apellidoUsuario" : this.formUsuario.controls.apellidoUsuario.value,
      "identificacionUsuario" : this.formUsuario.controls.identificacionUsuario.value,
      "tipoIdentificacion" : {
        "id" : this.formUsuario.controls.tipoIdentificacion.value,
      }
     }

    this.conexionServicio.Actualizar<IUsuario>(EendPoint.usuario, this.formUsuario.controls.id.value, objetousuario)
      .then(_registro => {        
        if (this.datosCargados) {
          this.datosConsultados.data[this.datosConsultados.data.findIndex(r => r.id == _registro.datos.id)] = _registro.datos;
          this.CargarDatosIngreso();
        }
        
        this.MostrarMensaje(new IDatosMensajes(`Resultado actualización`, _registro.mensaje));

      }
        , _error => {          
          this.MostrarMensaje(new IDatosMensajes("Error en actualización", _error, EnumTipoMensaje.error));
        });
  }

  public get datosCargados(): boolean {
    return (isNullOrUndefined(this.datosConsultados) ? false : (this.datosConsultados.data.length > 0));
  }

  private ActualizarDataSource(_datos?: Array<IUsuario>) {

    if (!isNullOrUndefined(_datos)) {
      this.datosConsultados = new MatTableDataSource(_datos);
    }else{
      this.tablaDatos.renderRows();
    }

    this.datosConsultados.paginator = this.paginador;
    this.datosConsultados.sort = this.ordenador;

    if (this.opcionSeleccionada != this.opciones.Buscar) {
      this.opcionSeleccionada = this.opciones.Agregar;
      this.AjustarValidaciones();
    }
  }

  public CambiarOpcion(_opcSeleccionada: number = 0, _registro?: IUsuario) {
    this.opcionSeleccionada = _opcSeleccionada;
    this.AjustarValidaciones(_registro);
  }

  private MostrarMensaje(_datos: IDatosMensajes): Promise<boolean> {
    this.cargando = false;
    return new Promise((resolve) => {
      const dialogRef = this.sMensaje.open(MensajeComponent, {
        data: _datos,
        panelClass: 'mensaje'
      });

      dialogRef.afterClosed().subscribe(_respuesta => {
        resolve(_respuesta);

      });
    });
  } 

  private CargarDatosTipoIdentificacion(): void {
    this.conexionServicio.Consultar<ITipoIdentificacion>(EendPoint.tipoDocumento, '')
      .then(_registros => {
        this.listTipIdentificacion = _registros.datos;        
      }
        , (_error) => {
          this.MostrarMensaje(new IDatosMensajes('Error en consulta', _error, EnumTipoMensaje.error));
        });        
  }  

  public SeleccionarRegistro(_registroSeleccionado: IUsuario) {    
    this.CambiarOpcion(this.opciones.Editar, _registroSeleccionado);
  }

  public AbrirPopup(_datos: IDatosPopup, valorId: number): void {    
    let objeto = {
      "columnas" : _datos.columnas,
      "id" : valorId
    }
    this.sMensaje.open(UsuarioTarjetaComponent, {
      hasBackdrop: false,
      autoFocus: true,
      panelClass: 'popups',
      data: objeto
    });
  }

  private buscarDetalle(usuario: IUsuario): void {
    this.valorId = usuario.id;
    let objeto = {      
      'usuario': {
        id: usuario.id        
      }
    };
    this.cargando = true;
    this.conexionServicio.Consultar<ITarjetaUsuario>(EendPoint.tarjetaUsuario, objeto)
      .then(_registros => {
        this.cargando = false;
        this.datosPopup = {
          'columnas': _registros.datos,
          'id': this.valorId
        }
    this.AbrirPopup(this.datosPopup, usuario.id);
  }
  , (_error) => {    
    this.cargando = false;
    this.datosPopup = {
      'columnas': [],
      'id': null          
    }
    this.AbrirPopup(this.datosPopup, this.valorId);
  });
  }


}
