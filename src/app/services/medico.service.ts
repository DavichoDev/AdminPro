import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Medico } from '../models/medico.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class MedicoService {
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

  // C
  crearMedico(medico: { nombre: string; hospital: string }) {
    const url = `${base_url}/medicos`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.post(url, medico, this.headers);
  }
  // R
  getMedicos() {
    const url = `${base_url}/medicos`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.get(url, this.headers).pipe(
      delay(500),
      map((response: any) => response.medicos)
    );
  }
  // U
  actualizarMedico(medico: Medico) {
    const url = `${base_url}/medicos/${medico._id}`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.put(url, medico, this.headers);
  }
  // D
  eliminarMedico(_id: string) {
    const url = `${base_url}/medicos/${_id}`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.delete(url, this.headers);
  }

  obtenerMedicoPorId(idMedico: string) {
    const url = `${base_url}/medicos/${idMedico}`;
    return this.http.get(url, this.headers).pipe(
      map((resp: { ok: boolean; medico: Medico }) => resp.medico )
    );
  }
}
