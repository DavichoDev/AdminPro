import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment.prod';
import { HttpClient } from '@angular/common/http';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root',
})
export class ModalImagenService {
  private ocultarModal: boolean = true;
  // Argumentos
  public tipo: 'usuarios' | 'medicos' | 'hospitales';
  public id: string;
  public img: string;

  public cambioEnImagen: EventEmitter<string> = new EventEmitter();

  constructor(private http: HttpClient) {}

  get ocultaModal() {
    return this.ocultarModal;
  }

  abrirModal(
    tipo: 'usuarios' | 'medicos' | 'hospitales',
    id: string,
    img: string = 'no-img'
  ) {
    this.ocultarModal = false;
    this.tipo = tipo;
    this.id = id;
    // this.img = img;

    if (img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/uploads/${tipo}/${img}`;
    }
  }

  cerrarModal() {
    this.ocultarModal = true;
  }
}
