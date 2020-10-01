import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService,
               private router: Router ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usuarioService.validarToken()
      .pipe(
        tap( estaAutentificado => {
          if ( !estaAutentificado ) {
            this.router.navigateByUrl('/login');
          }
        })
      );
  }

}
