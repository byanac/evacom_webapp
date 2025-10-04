import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ChiefEvaluatorGuard implements CanActivate {
  dataFromSessionStorage = this.loginService.GetUserSession();
  constructor(private router: Router,private loginService: LoginService) {}
  
  canActivate(): boolean {
    if (!this.dataFromSessionStorage.permisos[0].evaluadorJefe && !this.dataFromSessionStorage.permisos[1].evaluadorJefe) {
      Swal.fire('No tienes acceso','Has intentado acceder a una página para la cual tu cuenta no tiene permisos ya que solo está disponible para los evaluadores jefes. Serás redirigido a la página de inicio de sesión.','error').then(() => {
        this.router.navigate(['/login']); 
      })
      return false;
    }
    return true;
  }
}
