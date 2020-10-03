import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  public perfilForm: FormGroup;
  public usuario: Usuario;
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.formBuilder.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarUsuario(this.perfilForm.value).subscribe(
      (response) => {
        /* Actualización de los campos del usuario. */
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        /* En JS todos los objetos son pasados por referencia. */

        Swal.fire(
          'Actualización',
          '¡Datos actualizados exitosamente!',
          'success'
        );
      },
      (err) => {
        Swal.fire('Error', err.error.msg , 'error');
      }
    );
  }

  actualizarFoto(imagen: File) {
    this.imagenSubir = imagen;

    if ( !imagen ) { 
      return this.imgTemp = null;
     }

    const reader = new FileReader();
    reader.readAsDataURL( imagen );

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen() {
    this.fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      /* Se pasa por referencia la imagen al objeto del servicio */
      .then((img) => {
        this.usuario.img = img
        Swal.fire('Actualización', '¡Imagen de usuario actualizada exitosamente!', 'success');
      }
      ).catch( err => {
        Swal.fire('Error', err.error.msg , 'success');
      });
  }
}
