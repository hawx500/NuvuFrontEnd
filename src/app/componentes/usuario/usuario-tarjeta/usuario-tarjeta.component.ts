import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatPaginator, MatSort, MatTable, MatTableDataSource, MAT_DIALOG_DATA } from '@angular/material';
import { EnumTipoMensaje, IDatosMensajes, ITipoFranquicia, ITarjetaUsuario, IDatosPopup } from 'src/app/models/IUsuario';
import { ConexionServicioApiService } from 'src/app/services/conexion-servicio-api.service';
import { EendPoint } from 'src/app/utils/EendPoins.enum';
import { Eopciones } from 'src/app/utils/Egeneral.enum';
import { isNullOrUndefined } from 'util';
import { MensajeComponent } from '../../mensaje/mensaje.component';

@Component({
  selector: 'app-usuario-tarjeta',
  templateUrl: './usuario-tarjeta.component.html',
  styleUrls: ['./usuario-tarjeta.component.css']
})
export class UsuarioTarjetaComponent implements OnInit {

  public cargando: boolean = true;
  public formTarjetaUsuario: FormGroup;
  public opciones = Eopciones;
  public opcionSeleccionada: number = this.opciones.Agregar;
  public listTipFranquiciaTarjeta: Array<ITipoFranquicia>;

  public columnas: string[] = ['numeroTarjeta', 'nombreTarjeta', 'fechaCaducidad', 'numeroCcv', 'tipoFranquicia', 'activo'];
  public detalleConsultadas: MatTableDataSource<ITarjetaUsuario>;

  @ViewChild(MatPaginator, { static: false }) paginadorColumnas: MatPaginator;
  @ViewChild(MatSort, { static: false }) ordenadorColumnas: MatSort;
  @ViewChild('tablaColumnas', { static: false }) tablaColumnas: MatTable<IDatosPopup>;

  constructor(private conexionServicio: ConexionServicioApiService, private sMensaje: MatDialog, private ctrlPopup: MatDialogRef<UsuarioTarjetaComponent>,
    @Inject(MAT_DIALOG_DATA) public datosColumnas: IDatosPopup) {
    this.ActualizarDataSourceColumnas(datosColumnas.columnas);
    this.formTarjetaUsuario = new FormGroup({
      id: new FormControl(),
      numeroTarjeta: new FormControl(''),
      nombreTarjeta: new FormControl(''),
      fechaCaducidad: new FormControl(''),
      numeroCcv: new FormControl(''),
      tipoFranquicia: new FormControl('')
    })
    this.AjustarValidaciones();
  }

  private AjustarValidaciones(_datos: ITarjetaUsuario = {
    id: null,
    numeroTarjeta: null,
    nombreTarjeta: null,
    fechaCaducidad: null,
    numeroCcv: null,
    estadoTarjeta: null,
    tipoFranquicia: null
  }): void {

    if (_datos.tipoFranquicia != null) {
      this.formTarjetaUsuario.reset({
        id: _datos.id,
        numeroTarjeta: _datos.numeroTarjeta,
        nombreTarjeta: _datos.nombreTarjeta,
        fechaCaducidad: _datos.fechaCaducidad,
        numeroCcv: _datos.numeroCcv,
        estadoTarjeta: _datos.estadoTarjeta,
        tipoFranquicia: _datos.tipoFranquicia.id
      })
      
      this.formTarjetaUsuario.controls.numeroTarjeta.disable();
      this.formTarjetaUsuario.controls.nombreTarjeta.disable();
      this.formTarjetaUsuario.controls.tipoFranquicia.disable();
    } else {

      this.formTarjetaUsuario.reset({
        id: _datos.id,
        numeroTarjeta: _datos.numeroTarjeta,
        nombreTarjeta: _datos.nombreTarjeta,
        fechaCaducidad: _datos.fechaCaducidad,
        numeroCcv: _datos.numeroCcv,
        estadoTarjeta: _datos.estadoTarjeta,
        tipoFranquicia: _datos.tipoFranquicia
      })
      this.formTarjetaUsuario.controls.numeroTarjeta.enable();
      this.formTarjetaUsuario.controls.nombreTarjeta.enable();
      this.formTarjetaUsuario.controls.tipoFranquicia.enable();
    }
    this.cargando = false;
  }

  ngOnInit() {
    this.CargarDatosTipoFranquicia();
  }

  public EjecutarOperacion() {

    try {
      this.cargando = true;

      switch (this.opcionSeleccionada) {
        case this.opciones.Agregar:
          this.AgregarRegistro();
          break;
        case this.opciones.Editar:
          this.EditarRegistro();
          break;
      }

    }
    catch (_error) {
      this.cargando = false;
      this.MostrarMensaje(new IDatosMensajes("Error", _error, EnumTipoMensaje.error));
    }
  }

  private AgregarRegistro() {

    let objetoTarjetaUsuario = {
      usuario: {
        id: this.datosColumnas.id
      },
      numeroTarjeta: this.formTarjetaUsuario.controls.numeroTarjeta.value,
      nombreTarjeta: this.formTarjetaUsuario.controls.nombreTarjeta.value,
      fechaCaducidad: this.formTarjetaUsuario.controls.fechaCaducidad.value,
      numeroCcv: this.formTarjetaUsuario.controls.numeroCcv.value,
      estadoTarjeta: 1,
      tipoFranquicia: {
        id: this.formTarjetaUsuario.controls.tipoFranquicia.value
      }
    }    

    this.conexionServicio.Crear<ITarjetaUsuario>(EendPoint.tarjetaUsuario, objetoTarjetaUsuario)
      .then(_registro => {
        this.buscarDetalle();
        this.MostrarMensaje(new IDatosMensajes('Resultado registro', _registro.mensaje));

      }
        , _error => {
          this.MostrarMensaje(new IDatosMensajes('Error en registro', _error, EnumTipoMensaje.error));
        });
  }

  private EditarRegistro() {
    let objetoTarjetaUsuario = {
      usuario: {
        id: this.datosColumnas.id
      },
      numeroTarjeta: this.formTarjetaUsuario.controls.numeroTarjeta.value,
      nombreTarjeta: this.formTarjetaUsuario.controls.nombreTarjeta.value,
      fechaCaducidad: this.formTarjetaUsuario.controls.fechaCaducidad.value,
      numeroCcv: this.formTarjetaUsuario.controls.numeroCcv.value,
      estadoTarjeta: 1,
      tipoFranquicia: {
        id: this.formTarjetaUsuario.controls.tipoFranquicia.value
      }
    }

    this.conexionServicio.Actualizar<ITarjetaUsuario>(EendPoint.tarjetaUsuario, this.formTarjetaUsuario.controls.id.value, objetoTarjetaUsuario)
      .then(_registro => {        
        if (this.datosCargados) {
          this.detalleConsultadas.data[this.detalleConsultadas.data.findIndex(r => r.id == _registro.datos.id)] = _registro.datos;
          this.ActualizarDataSource();
        }        
        this.MostrarMensaje(new IDatosMensajes(`Resultado actualización`, _registro.mensaje));

      }
        , _error => {
          this.MostrarMensaje(new IDatosMensajes("Error en actualización", _error, EnumTipoMensaje.error));
        });
  }

  public CambiarEstado(_registro: ITarjetaUsuario) {
    try {      
      _registro.estadoTarjeta = !_registro.estadoTarjeta;     
      this.cargando = true;

      this.conexionServicio.CambiarEstado(EendPoint.tarjetaUsuario, _registro.id, _registro)
        .then(_resultado => {          
          this.buscarDetalle();
          
          this.MostrarMensaje(new IDatosMensajes(`Resultado actualización`, _resultado));
        }
          , _error => {
            _registro.activo = !_registro.activo;
            console.error('SpoolParametroDetComponent - CambiarEstado - Exception', _error);            
            this.MostrarMensaje(new IDatosMensajes("Error en actualización", _error, EnumTipoMensaje.error));
          });
    }
    catch (_error) {
      _registro.activo = !_registro.activo;      
      this.MostrarMensaje(new IDatosMensajes("Error en actualización", _error, EnumTipoMensaje.error));
    }
  }

  private buscarDetalle(): void {
    let objeto = {
      'usuario': {
        id: this.datosColumnas.id
      }
    };
    this.cargando = true;
    this.conexionServicio.Consultar<ITarjetaUsuario>(EendPoint.tarjetaUsuario, objeto)
      .then(_registros => {
        this.cargando = false;
        this.ActualizarDataSourceColumnas(_registros.datos);
      }
        , (_error) => {
          this.cargando = false;
        });
  }

  public get datosCargados(): boolean {
    return (isNullOrUndefined(this.detalleConsultadas) ? false : (this.detalleConsultadas.data.length > 0));
  }

  private CargarDatosTipoFranquicia(): void {
    this.conexionServicio.Consultar<ITipoFranquicia>(EendPoint.tipoFranquicia, '')
      .then(_registros => {
        this.listTipFranquiciaTarjeta = _registros.datos;
        console.log(this.listTipFranquiciaTarjeta);
      }
        , (_error) => {
          this.MostrarMensaje(new IDatosMensajes('Error en consulta', _error, EnumTipoMensaje.error));
        });
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

  public Volver() {
    this.ctrlPopup.close();
  }

  public CambiarOpcion(_opcSeleccionada: number = 0, _registro?: ITarjetaUsuario) {

    this.opcionSeleccionada = _opcSeleccionada;
    this.AjustarValidaciones(_registro);
  }

  private ActualizarDataSourceColumnas(_datos?: Array<ITarjetaUsuario>) {

    if (!isNullOrUndefined(_datos)) {
      this.datosColumnas.columnas = _datos;
      this.detalleConsultadas = new MatTableDataSource(_datos);
    }
    else {
      this.detalleConsultadas = new MatTableDataSource(_datos);
      this.tablaColumnas.renderRows();
    }

    setTimeout(() => this.detalleConsultadas.paginator = this.paginadorColumnas);
    this.detalleConsultadas.sort = this.ordenadorColumnas;

  }

  public SeleccionarRegistro(_registroSeleccionado: ITarjetaUsuario) {
    this.CambiarOpcion(this.opciones.Editar, _registroSeleccionado);
  }

  private ActualizarDataSource(_datos?: Array<ITarjetaUsuario>) {
    
    if (!isNullOrUndefined(_datos))
      this.detalleConsultadas = new MatTableDataSource(_datos);
    else
      this.tablaColumnas.renderRows();
    
    this.detalleConsultadas.paginator = this.paginadorColumnas;
    this.detalleConsultadas.sort = this.ordenadorColumnas;
  }

}
