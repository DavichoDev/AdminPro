import { Usuario } from '../models/usuario.model';

export interface GetUsuarios {
    totalRegistros: number;
    usuarios: Usuario[];
}
