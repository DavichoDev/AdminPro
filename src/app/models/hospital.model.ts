
// tslint:disable-next-line: class-name
interface _HospitalUser {
    _id: string;
    nombre: string;
    img: string;
}

export class Hospital {
  constructor(
    public nombre: string,
    // tslint:disable-next-line: variable-name
    public _id?: string,
    public usuario?: string,
    public img?: string,
  ) {}

}
