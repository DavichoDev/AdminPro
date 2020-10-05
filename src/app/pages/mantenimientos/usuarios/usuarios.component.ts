import { Component, OnInit, OnDestroy } from '@angular/core';
import { Usuario } from '../../../models/usuario.model';

import { UsuarioService } from '../../../services/usuario.service';
import { BusquedasService } from '../../../services/busquedas.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import Swal from 'sweetalert2';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [],
})
export class UsuariosComponent implements OnInit {
  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public cargando: boolean = true;

  public imgSubs: Subscription;

  constructor(
    private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    // modal ==>
    private modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    // Se obtienen Usuarios de la base de datos.
    this.cargarUsuarios();
    // Se refrescan los usuarios modificados.
    this.refreshUsuarios();
  }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  refreshUsuarios() {
    // Se recargan usuarios cuando ocurre un cambio en el modal.
    this.imgSubs = this.modalImagenService.cambioEnImagen
      .pipe(delay(500))
      .subscribe(() => this.cargarUsuarios());
  }

  cambiarRole(usuario: Usuario) {
    this.usuarioService
      .guardarUsuario(usuario)
      .subscribe((response) => console.log(response));
  }

  eliminarUsuario(usuario: Usuario) {
    if (usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puedes borrarse a sí mismo.', 'error');
    }

    Swal.fire({
      title: '¿Borrar usuario?',
      text: `Esta a punto de borrar a ${usuario.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Si, borralo!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminarUsuario(usuario).subscribe((respuesta) => {
          Swal.fire(
            '¡Usuario Borrado!',
            `El usuario ${usuario.nombre} se borró con éxito.`,
            'success'
          );
          // Refresh usuarios.
          this.cargarUsuarios();
        });
      }
    });
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService
      .getUsuarios(this.desde)
      .subscribe(({ usuarios, totalRegistros }) => {
        this.totalUsuarios = totalRegistros;
        this.usuarios = usuarios;
        this.cargando = false;
        // Usuarios Temporales
        this.usuariosTemp = usuarios;
      });
  }

  cambiarPagina(valor: number) {
    this.desde += valor;
    if (this.desde < 0) {
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios) {
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }

  buscar(termino: string) {
    if (!termino) {
      this.usuarios = this.usuariosTemp;
      return;
    }

    this.busquedasService
      .buscar('usuarios', termino)
      .subscribe((resultados) => {
        this.usuarios = resultados;
      });
  }

  abrirModal(usuario: Usuario) {
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img);
  }
}
