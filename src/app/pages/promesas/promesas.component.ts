import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: [
  ]
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    this.getUsuarios().then( usuarios => {
      console.log(usuarios);
    });

/*     const promesa = new Promise( (resolve, reject) => {

      if (false) {
        resolve('HolaMundillo :3');
      } else {
        reject('Algo salio mal');
      }


    } );

    promesa.then( ( mensaje ) => {
      console.log( mensaje );
    })
    .catch ( error => console.log('Error en mi promesa', error) );

    console.log('Fin del OnInit'); */

  }

  getUsuarios() {

    return new Promise( resolve => {

      fetch('https://reqres.in/api/users?page=2')
      .then( response => response.json()
      .then( body => resolve( body.data ) ) );

    } );

  }

}
