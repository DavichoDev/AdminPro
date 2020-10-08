import { Hospital } from './hospital.model';

// tslint:disable-next-line: class-name
interface _MedicoUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Medico {
  constructor(
    public nombre: string,
    public _id?: string,
    public img?: string,
    public usuario?: _MedicoUser,
    public hospital?: Hospital
  ) {}

}
