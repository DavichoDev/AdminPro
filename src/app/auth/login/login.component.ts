import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';

declare const gapi: any;

// Externos
import Swal from 'sweetalert2';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.formBuilder.group(
    {
      email: [
        localStorage.getItem('email') || '',
        [Validators.required, Validators.email],
      ],
      password: ['', [Validators.required]],
      remember: [localStorage.getItem('rememberMe') === null ? false : true],
    },
    {}
  );

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.renderButton();
  }

  login() {
    this.usuarioService.login(this.loginForm.value).subscribe(
      (response) => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
          localStorage.setItem(
            'rememberMe',
            this.loginForm.get('remember').value
          );
        } else {
          localStorage.removeItem('email');
          localStorage.removeItem('rememberMe');
        }

        console.log(response);
        this.router.navigateByUrl('/');
      },
      (err) => {
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  renderButton() {
    gapi.signin2.render('my-signin2', {
      scope: 'profile email',
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'dark',
    });

    this.startApp();
  }

  async startApp() {
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element) {
    console.log(element.id);
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        const idToken = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(idToken).subscribe((response) => {
          // Navegar al Dashboard
          this.ngZone.run(() => {
            this.router.navigateByUrl('/');
          });
        });
      },
      (error) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
}
