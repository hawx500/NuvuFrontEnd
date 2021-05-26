import { IEntidadGeneral } from "./IEntidadGeneral";

export interface IUsuario extends IEntidadGeneral<number>{
    nombreUsuario?: string;
    apellidoUsuario?: string;    
    identificacionUsuario?: string;
    tipoIdentificacion?: ITipoIdentificacion    
}

export interface ITipoIdentificacion {
    id?: number;
    tipoDocumento?: string;
}

export interface ITarjetaUsuario extends IEntidadGeneral<number>{
    numeroTarjeta?: number,
    nombreTarjeta?: string,
    fechaCaducidad?: Date,
    numeroCcv?: number,
    estadoTarjeta?: boolean,
    tipoFranquicia?: ITipoFranquicia
}

export interface IDatosPopup {
    columnas: ITarjetaUsuario[],
    id?: number
}

export interface ITipoFranquicia {
    id?: number,
    franquicia?: string
}

export class IDatosMensajes {
    titulo: string;
    mensaje: string;
    tipoMensaje: EnumTipoMensaje;

    constructor( _titulo: string, _mensaje: string, _tipoMensaje: EnumTipoMensaje = EnumTipoMensaje.informacion) {
       this.titulo = _titulo;
       this.mensaje = _mensaje;
       this.tipoMensaje = _tipoMensaje;
    }
}

export enum EnumTipoMensaje {
    informacion = 0,
    confirmacion,
    error
}