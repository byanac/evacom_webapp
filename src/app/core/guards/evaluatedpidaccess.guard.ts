import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/auth/login.service';
import { PidService } from 'src/app/services/pid/pid.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class EvaluatedpidaccessGuard implements CanActivate {
  DataFromSessionStorage = this.loginService.GetUserSession();
  showEvaluatedAccessPID: boolean = false;

  constructor(private router: Router,private loginService: LoginService, private pidService: PidService) {}
  
  async canActivate(): Promise<boolean> {
    await this.LoadEvaluatedPIDAccess();
    
    if (!this.showEvaluatedAccessPID) {
      Swal.fire('No tienes acceso','No es necesario que registres la fase de PID - CUMPLIMIENTO. Serás redirigido a la página de inicio de sesión.','error').then(() => {
        this.router.navigate(['/login']);
      })
      return false;
    }
    return true;
  }

  async LoadEvaluatedPIDAccess(): Promise<any>{
    try{
      const data = await this.pidService.GetPIDEvaluatedValidation(this.DataFromSessionStorage.ficha,this.DataFromSessionStorage.codPuesto,this.isUserEvaluated().codCalendario).toPromise();
      this.showEvaluatedAccessPID = data.registros
    }catch (error) {
      console.error('Error al cargar los permisos de PID del evaluado:', error);
      return Swal.fire('Error al cargar los permisos de PID del evaluado', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => this.router.navigate(['/login']));;
    }
  }

  isUserEvaluated(): {codCalendario: string | any, estadoEvaluado: boolean}{
    if (this.DataFromSessionStorage.permisos[0].evaluado && this.DataFromSessionStorage.permisos[1].evaluado) {
      let CalendarData: any =  {codCalendario: {calendario180: this.DataFromSessionStorage.permisos[0].evaluado,calendario90: this.DataFromSessionStorage.permisos[1].evaluado},estadoEvaluado: true};  
      return CalendarData
    }else if(this.DataFromSessionStorage.permisos[0].evaluado){
      let CalendarData: any = {codCalendario: this.DataFromSessionStorage.permisos[0].calendario, estadoEvaluado: this.DataFromSessionStorage.permisos[0].evaluado}
      return CalendarData
    }else{
      let CalendarData: any =  {codCalendario: this.DataFromSessionStorage.permisos[1].calendario, estadoEvaluado: this.DataFromSessionStorage.permisos[1].evaluado}
      return CalendarData
    }
  }
}
