import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class BusquedasService {
  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  private transformarUsuarios(resultados: any[]): Usuario[] {
    return resultados.map(
      (user) =>
        new Usuario(
          user.nombre,
          user.email,
          '',
          user.uid,
          user.role,
          user.google,
          user.img
        )
    );
  }

  private transformarHospitales(resultados: any[]): Hospital[] {
    return resultados.map(
      (hospital) =>
        new Hospital(
          hospital.nombre,
          hospital._id,
          hospital.usuario,
          hospital.img
        )
    );
  }

  private transformarMedicos(resultados: any[]): Medico[] {
    return resultados.map(
      (medico) =>
        new Medico(
          medico.nombre,
          medico._id,
          medico.img,
          medico.usuario,
          medico.hospital
        )
    );
  }

  buscar(tipo: 'usuarios' | 'medicos' | 'hospitales', termino: string): any{
    const url = `${base_url}/todo/coleccion/${tipo}/${termino}`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.get<any[]>(url, this.headers).pipe(
      map((response: any) => {
        switch (tipo) {
          case 'usuarios':
            return this.transformarUsuarios(response.resultados);

          case 'hospitales':
            return this.transformarHospitales( response.resultados );

          case 'medicos':
            return this.transformarMedicos( response.resultados );
        }
      })
    );
  }

  busquedaGlobal( termino: string ) {
    const url = `${base_url}/todo/${termino}`;
    return this.http.get( url, this.headers );
  }

}
