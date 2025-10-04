import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const dataFromSessionStorage = JSON.parse(sessionStorage.getItem('userdata') || null);

    if (!dataFromSessionStorage) {
      ////console.log('Valid Session Guard')
      this.router.navigate(['/login']); // Redirige a la página de login
      sessionStorage.clear(); //Borramos el Session Storage
      return false;
    }
    
    return true;
  }
}
