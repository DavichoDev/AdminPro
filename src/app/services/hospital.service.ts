import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.prod';
import { Hospital } from '../models/hospital.model';
import { delay, map } from 'rxjs/operators';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class HospitalService {
  constructor(private http: HttpClient) {}

  get token(): string {
    return localStorage.getItem('token');
  }

  get headers() {
    return { headers: { 'x-token': this.token } };
  }

  crearHospital(nombre: string) {
    const url = `${base_url}/hospitales`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    const url = `${base_url}/hospitales/${_id}`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.put(url, { nombre }, this.headers);
  }

  eliminarHospital(_id: string) {
    const url = `${base_url}/hospitales/${_id}`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.delete(url, this.headers);
  }

  getHospitales() {
    const url = `${base_url}/hospitales`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.get(url, this.headers).pipe(
      delay(500),
      map((resp: { ok: boolean; hospitales: Hospital[] }) => resp.hospitales)
    );
  }
}
