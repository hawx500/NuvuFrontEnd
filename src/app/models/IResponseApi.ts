export interface IResponseApi<T> {
    datos?: T;
    codigo: number;
    mensaje: string;
  }

  export class datos<T> {
    
    entidad: T;

    constructor(_entidad: T) {       
        this.entidad = _entidad;
    }
}