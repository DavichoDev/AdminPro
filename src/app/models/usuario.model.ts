import { environment } from '../../environments/environment.prod';

const base_url = environment.base_url;

export class Usuario {
  constructor(
    public nombre: string,
    public email: string,
    public password?: string,
    public uid?: string,
    public role?: string,
    public google?: boolean,
    public img?: string
  ) {}

  get imagenURL() {
    if (this.img.includes('https')) {
      return this.img;
    }

    if (this.img) {
      return `${base_url}/uploads/usuarios/${this.img}`;
    } else {
      return `${base_url}/uploads/usuarios/no-image.jpg`;
    }
  }
}
