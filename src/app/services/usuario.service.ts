import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { tap, map, catchError, delay } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

import Swal from 'sweetalert2';

import { RegisterForm } from '../interfaces/register-form.interfaces';
import { LoginForm } from '../interfaces/login-form.interfaces';
import { Usuario } from '../models/usuario.model';
import { GetUsuarios } from '../interfaces/cargar-usuarios.interface';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  public auth2: any;
  public usuario: Usuario;

  constructor(
    private http: HttpClient,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.googleInit();
  }

  get token() {
    return localStorage.getItem('token') || '';
  }

  get uid() {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token,
      },
    };
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario.role;
  }

  guardarLocalStorage(token: string, menu: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  validarToken(): Observable<boolean> {
    const token = this.token;

    return this.http
      .get(`${base_url}/auth/login/renew`, {
        headers: { 'x-token': token },
      })
      .pipe(
        tap((response: any) => {
          const {
            email,
            google,
            img = '',
            nombre,
            role,
            uid,
          } = response.usuario;
          this.usuario = new Usuario(nombre, email, '', uid, role, google, img);
          this.guardarLocalStorage(response.token, response.menu);
        }),
        map((response) => true),
        catchError((error) => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  actualizarUsuario(data: { email: string; nombre: string; role: string }) {
    data = {
      ...data,
      role: this.usuario.role,
    };

    return this.http.put(
      `${base_url}/usuarios/${this.uid}`,
      data,
      this.headers
    );
  }

  guardarUsuario(usuario: Usuario) {
    return this.http.put(
      `${base_url}/usuarios/${usuario.uid}`,
      usuario,
      this.headers
    );
  }

  eliminarUsuario(usuario: Usuario) {
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  getUsuarios(desde: number = 0) {
    const url = `${base_url}/usuarios?desde=${desde}`;
    // Podemos definir el tipo de información que va a retornar la petición.
    return this.http.get<GetUsuarios>(url, this.headers).pipe(
      delay(500),
      map((response) => {
        const usuarios = response.usuarios.map(
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
        return {
          totalRegistros: response.totalRegistros,
          usuarios,
        };
      })
    );
  }

  // Autentificación || GoogleAuth
  login(formData: LoginForm) {
    return this.http.post(`${base_url}/auth/login`, formData).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  logOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('menu');

    this.auth2.signOut().then(() => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  loginGoogle(token) {
    return this.http.post(`${base_url}/auth/login/google`, { token }).pipe(
      tap((resp: any) => {
        this.guardarLocalStorage(resp.token, resp.menu);
      })
    );
  }

  googleInit() {
    return new Promise((resolve) => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id:
            '214723721086-f6ectim42nvbqvjgvngrtoh9mvjh0r7n.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });
    });
  }
}
