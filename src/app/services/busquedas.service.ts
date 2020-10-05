import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  private transformarUsuarios( resultados: any[] ): Usuario[] {
    return resultados.map(
      user => new Usuario(user.nombre, user.email, '', user.uid, user.role, user.google, user.img )
    );
  }

  buscar(
    tipo: 'usuarios'|'medicos'|'hospitales',
    termino: string
    ) {
    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.get<any[]>( url, this.headers )
      .pipe(
        map( (response: any) => {
          switch ( tipo ) {
            case 'usuarios':
              return this.transformarUsuarios( response.resultados );

            case 'usuarios':
            break;

            case 'usuarios':
            break;

            default:
              break;
          }
        } )
      );
  }

}
