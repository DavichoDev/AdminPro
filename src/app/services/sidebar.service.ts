import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {

  public menu = [];

  constructor(private router: Router) {}

  cargarMenu() {
    this.menu = JSON.parse(localStorage.getItem('menu')) || [];

    if ( this.menu.length === 0 ) {
      this.router.navigateByUrl('/login');
    }
  }

}
