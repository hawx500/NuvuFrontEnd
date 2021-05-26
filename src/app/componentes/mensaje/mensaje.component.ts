import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EnumTipoMensaje, IDatosMensajes } from 'src/app/models/IUsuario';


@Component({
  selector: 'app-mensaje',
  templateUrl: './mensaje.component.html',
  styleUrls: ['./mensaje.component.css']
})
export class MensajeComponent {

  public textOk: string;

  constructor(
    public dialogRef: MatDialogRef<MensajeComponent>,
    @Inject(MAT_DIALOG_DATA) public datosMensaje: IDatosMensajes) {
            
      this.textOk = (datosMensaje.tipoMensaje == EnumTipoMensaje.confirmacion) ? 'Confirmar' : 'ACEPTAR';
  }

  /**
   * Retorna la respuesta seleccionada por el usuario
   * @param _respuestaluis
   */
  RetornarRespuesta(_respuesta: boolean): void {
    this.dialogRef.close(_respuesta);
  }

  /**
   * Indica cuando se debe mostrar el boton cancelar en el model de mensaje
   */
  public get mostrarCancelar(): boolean {
    return (this.datosMensaje.tipoMensaje == EnumTipoMensaje.confirmacion);
  }

  public get isError(): boolean {
    return (this.datosMensaje.tipoMensaje == EnumTipoMensaje.error);
  }

  


}
