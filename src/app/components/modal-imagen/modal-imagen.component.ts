import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [],
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir: File;
  public imgTemp: any = null;

  constructor(
    public modalImagenService: ModalImagenService,
    private fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  actualizarFoto(imagen: File) {
    this.imagenSubir = imagen;

    if (!imagen) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(imagen);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      /* Se pasa por referencia la imagen al objeto del servicio */
      .then((img) => {
        Swal.fire(
          'Actualización',
          '¡Imagen de usuario actualizada exitosamente!',
          'success'
        );

        // Event emitter llamado.
        this.modalImagenService.cambioEnImagen.emit(img);

        this.cerrarModal();
      })
      .catch((err) => {
        Swal.fire('Error', err.error.msg, 'success');
      });
  }
}
