import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { datos, IResponseApi } from '../models/IResponseApi';
import { catchError } from 'rxjs/operators';
import { isNullOrUndefined } from 'util';
import { environment } from 'src/environments/environment';
import { EendPoint } from '../utils/EendPoins.enum';

const C_HEADER: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });

@Injectable({
  providedIn: 'root'
})
export class ConexionServicioApiService {

  constructor(public apiHttp: HttpClient) { }

  private getEndPoint(_metodo: string): string {
    return `${environment.server}${_metodo}`;
  }

  /**
   * Realiza una petición GET al endpoint indicado
   * @param _endpoint 
   */
   public Get<T>(_endpoint: string, _params?: HttpParams | { [param: string]: string | string[] }): Observable<IResponseApi<Array<T>>> {

    return this.apiHttp.get<IResponseApi<Array<T>>>(_endpoint, { params: _params, headers: C_HEADER, observe: "body", responseType: 'json' })
      .pipe(
        catchError(this.ControlError)
      );
  }

  /**
   * Realiza un petición POST al endpoint indicado
   * @param _endpoint 
   * @param _params 
   */
   public Post<T>(_endpoint: string, _params?: Object): Observable<IResponseApi<T>> {

    return this.apiHttp.post<IResponseApi<T>>(_endpoint, _params, { headers: C_HEADER, observe: 'body', responseType: 'json' })
      .pipe(
        catchError(this.ControlError)
      );
  } 

  public Put<T>(_endpoint: string, _params?: Object): Observable<IResponseApi<T>> {

    return this.apiHttp.put<IResponseApi<T>>(_endpoint, _params, { headers: C_HEADER, observe: 'body', responseType: 'json' })
      .pipe(
        catchError(this.ControlError)
      );

  }

  public ControlError(_error: HttpErrorResponse) {        

    if (isNullOrUndefined(_error.error))
      return throwError(`Error realizando operación. Por favor, intente nuevamente.\nSi el problema persiste, contecte al administrador.`);

    if (!isNullOrUndefined(_error.error.mensaje))
      return throwError(_error.error.mensaje);

    if (_error.error! instanceof ErrorEvent) {
      if (_error.status == 500)
        return throwError(_error.message);
    }

    return throwError(`Error realizando operación. Por favor, intente nuevamente.\nSi el problema persiste, contecte al administrador.`);
  };

  public Consultar<T>(_opcion: EendPoint, _params?: any, _metodo: string = 'find'): Promise<IResponseApi<Array<T>>> {

    return new Promise((resolve, reject) => {

      const params: HttpParams | { [param: string]: string | string[] } = (isNullOrUndefined(_params) ? null : new HttpParams({ fromObject: { 'datosFiltro': JSON.stringify(_params) } }));

      this.Get<T>(`${this.getEndPoint(_opcion)}/${_metodo}`, params)
        .subscribe((_result) => {          
          if (_result.codigo == 0)
            return resolve(_result);
          else
            return reject(_result.mensaje);
        }
          , (_error => {            
            reject(_error);
          })
        );
    });
  }

  public Crear<T>(_opcion: EendPoint, _newRegistro: any, _metodo: string = 'save'): Promise<IResponseApi<T>> {
    return new Promise((resolve, reject) => {
      this.Post<T>(`${this.getEndPoint(_opcion)}/${_metodo}`, new datos(_newRegistro))
        .subscribe((_result) => {          
          if (_result.codigo == 0)
            return resolve(_result);
          else
            return reject(_result.mensaje);
        }
          , (_error => {            
            reject(_error);
          })
        );
    });
  }

  public Actualizar<T>(_opcion: EendPoint, _idRegistro: string, _infoUpdate: any, _metodo: string = 'update'): Promise<IResponseApi<T>> {
    return new Promise((resolve, reject) => {
      this.Put<T>(`${this.getEndPoint(_opcion)}/${_metodo}/${_idRegistro}`, new datos(_infoUpdate))
        .subscribe((_result) => {         
          if (_result.codigo == 0)
            return resolve(_result);
          else
            return reject(_result.mensaje);
        }
          , (_error => {
            console.error('ApiBasicasService - Actualizar', _opcion, _error);
            reject(_error);
          })
        );
    });
  } 

  public CambiarEstado<T>(_opcion: EendPoint, _id: number | string, _infoRegistro: T, _metodo: string = 'updateStatus'): Promise<string> {
    return new Promise((resolve, reject) => {
      this.Put<T>(`${this.getEndPoint(_opcion)}/${_metodo}/${_id}`, new datos(_infoRegistro))
        .subscribe((_result) => {          
          if (_result.codigo == 0)
            return resolve(_result.mensaje);
          else
            return reject(_result.mensaje);
        }
          , (_error => {            
            reject(_error);
          })
        );
    });
  }
  
}
