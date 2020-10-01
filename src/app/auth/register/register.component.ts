import { Component} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

// Externos
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent {

  // Control del envio de Información.
  public formSubmitted = false;

  constructor( private formBuilder: FormBuilder,
               private ususarioService: UsuarioService,
               private router: Router ) { }

  // Controlador del Formulario
  public registerForm = this.formBuilder.group({
    nombre:    ['', [ Validators.required ] ],
    email:     ['', [ Validators.required, Validators.email ] ],
    password:  ['', [ Validators.required] ],
    password2: ['', [ Validators.required] ],
    terminos:  [ false , [ Validators.required] ],
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  crearUsuario() {
    this.formSubmitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    // Realización de posteo.
    this.ususarioService.crearUsuario( this.registerForm.value )
        .subscribe( response => {
          this.router.navigateByUrl('/');
        }, (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        });
  }

  // Validaciones.

  campoNoValido( campo: string ): boolean {

    if ( this.registerForm.get(campo).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos() {
    return !this.registerForm.get('terminos').value && this.formSubmitted ;
  }

  contrasenasNoValidas(){
    const password = this.registerForm.get('password').value;
    const password2 = this.registerForm.get('password2').value;

    if ( password === password2 ) {
      return false;
    } else {
      return true;
    }
  }

  passwordsIguales( pass1Value: string, pass2Value: string ) {

    /* Retorna un formGroup que toma como argumentos los valores de
       los 'inputs', y si los valores son igual no retorna ningún error,
       en caso de ser diferentes inicializa un error como: {noEsIgual}.
    */
    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1Value);
      const pass2Control = formGroup.get(pass2Value);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors(null);
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    };

  }

}
