import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EvaluatedGuard implements CanActivate {
  dataFromSessionStorage = this.loginService.GetUserSession();
  constructor(private router: Router,private loginService: LoginService) {}
  
  canActivate(): boolean {
    if (this.dataFromSessionStorage.permisos[0].evaluado === false && this.dataFromSessionStorage.permisos[1].evaluado === false) {
      ////console.log('Valid Evaluated Guard')
      Swal.fire('No tienes acceso','Has intentado acceder a una página para la cual tu cuenta no tiene permisos. Serás redirigido a la página de inicio de sesión.','error').then(() => {
        this.router.navigate(['/login']); // Redirige a la página de login
      })
      return false;
    }
    return true;
  }
}
