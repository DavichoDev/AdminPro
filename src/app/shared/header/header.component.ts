import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [],
})
export class HeaderComponent implements OnInit {
  public usuario: Usuario;

  constructor(private usuarioService: UsuarioService) {
    // Carga datos del usuario.
    this.usuario = this.usuarioService.usuario;
    console.log(this.usuario);
  }

  ngOnInit(): void {}

  logOut() {
    this.usuarioService.logOut();
  }
}
