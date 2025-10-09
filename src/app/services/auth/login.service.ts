import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/interfaces/loginRequest';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { decodeToken } from 'src/app/core/utils/token';
import { ILoginData } from 'src/app/interfaces/ILoginData';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient, private router: Router) { }

  private mensajeMostrado = false;

  loginApi(username: string, password: string): Observable<any> {
    const userCredentials: LoginRequest = { username, password };
    if (isDevMode()) {
      //if (true){
      console.log('LoginAPI:', environment.LoginAPI);
      return this.http.get<any>(environment.LoginAPI).pipe(
        map((userFromRequest: LoginRequest) => {
          if (userFromRequest.username === username) {
            return userFromRequest;
          }
        })
      );
    } else {
      return this.http.post(environment.LoginAPI, userCredentials).pipe(
        map((userFromRequest: any) => {
          sessionStorage.setItem('token', userFromRequest.token);
          userFromRequest = decodeToken(userFromRequest.token);
          return userFromRequest;
        })
      );
    }
  }

  GetUserSession(): ILoginData {
    return JSON.parse(sessionStorage.getItem('userdata') || '{}');
  }

  GetTokenSession(): string {
    return sessionStorage.getItem('token');
  }

  IsUserAdmin(): boolean {
    const userData = this.GetUserSession();
    return userData && userData.indRolAdmin !== undefined ? userData.indRolAdmin : false;
  }

  isUserEvaluator(): any {
    const userData = this.GetUserSession();

    let EvaluatorCalendarData: any = {
      codCalendario: null,
      estadoEvaluador: false,
      evaluadorjefe: false
    };

    if (userData.permisos.length !== 0 && userData.permisos !== undefined && userData.permisos !== null) {
      const permisos = userData && userData.permisos ? userData.permisos : [];
      const CalendarType90Data = permisos.find((data: { tipo: string }) => data.tipo === '90');
      const CalendarType180Data = permisos.find((data: { tipo: string }) => data.tipo === '180');

      const evaluador90 = CalendarType90Data && CalendarType90Data.evaluador !== undefined ? CalendarType90Data.evaluador : false;
      const evaluador180 = CalendarType180Data && CalendarType180Data.evaluador !== undefined ? CalendarType180Data.evaluador : false;
      const evaluadorJefe90 = CalendarType90Data && CalendarType90Data.evaluadorJefe !== undefined ? CalendarType90Data.evaluadorJefe : false;
      const evaluadorJefe180 = CalendarType180Data && CalendarType180Data.evaluadorJefe !== undefined ? CalendarType180Data.evaluadorJefe : false;
      const calendario90 = CalendarType90Data && CalendarType90Data.calendario !== undefined ? CalendarType90Data.calendario : null;
      const calendario180 = CalendarType180Data && CalendarType180Data.calendario !== undefined ? CalendarType180Data.calendario : null;


      switch (true) {
        case (evaluador180 && evaluador90):
          EvaluatorCalendarData = {
            codCalendario: {
              calendario180: calendario180,
              calendario90: calendario90
            },
            estadoEvaluador: true,
            evaluadorjefe: {
              EvaluadorJefe180: evaluadorJefe180,
              EvaluadorJefe90: evaluadorJefe90
            }
          };
          break;

        case (evaluador180):
          EvaluatorCalendarData = {
            codCalendario: [{ calendario180 }],
            estadoEvaluador: true,
            evaluadorjefe: evaluadorJefe180
          };
          break;

        case (evaluador90):
          EvaluatorCalendarData = {
            codCalendario: [{ calendario90 }],
            estadoEvaluador: true,
            evaluadorjefe: evaluadorJefe90
          };
          break;

        case (!evaluador90 && !evaluador180):
          EvaluatorCalendarData = {
            codCalendario: null,
            estadoEvaluador: false,
            evaluadorjefe: false
          };
          break;
      }

      return EvaluatorCalendarData;
    } else {
      let EvaluatorCalendarData = {
        codCalendario: null,
        estadoEvaluador: false,
        evaluadorjefe: false
      };

      return EvaluatorCalendarData
    }
  }

  isUserEvaluated(): { codCalendario: string, estadoEvaluado: boolean, FechasDeCalendario?: any[] } {
    const userData = this.GetUserSession();
    const permisos = userData && userData.permisos ? userData.permisos : [];
    if (permisos.length !== 0 && permisos !== undefined && permisos !== null) {
      const CalendarType90Data: any = permisos.find((data: { tipo: string }) => data.tipo === '90') || {};
      const CalendarType180Data: any = permisos.find((data: { tipo: string }) => data.tipo === '180') || {};

      const evaluado90 = CalendarType90Data && CalendarType90Data.evaluado !== undefined ? CalendarType90Data.evaluado : false;
      const evaluado180 = CalendarType180Data && CalendarType180Data.evaluado !== undefined ? CalendarType180Data.evaluado : false;

      let CalendarData: any = [];
      switch (true) {
        case (evaluado90 && evaluado180):
          if (!this.mensajeMostrado) {
            this.mensajeMostrado = true;

            // Esperar a que termine el ciclo de detección de Angular antes de mostrar el SweetAlert
            setTimeout(() => {
              Swal.fire({
                title: 'Es evaluado en dos calendarios',
                text: 'El usuario no puede tener el rol de evaluado en dos calendarios diferentes.',
                type: 'info', // usa 'type' en vez de 'icon'
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then(() => {
                this.router.navigateByUrl('/home');
              });
            }, 500); // 300ms suelen bastar; puedes subir a 500 si sigue siendo muy rápido
          }
          break;


        case (evaluado90):
          CalendarData = {
            codCalendario: CalendarType90Data.calendario || null,
            estadoEvaluado: evaluado90,
          };
          break;
        case (evaluado180):
          CalendarData = {
            codCalendario: CalendarType180Data.calendario || null,
            estadoEvaluado: evaluado180,
          };
          break;
        default:
          CalendarData = {
            codCalendario: null,
            estadoEvaluado: false,
          };
          break;
      }

      return CalendarData;
    } else {
      let CalendarData = {
        codCalendario: null,
        estadoEvaluado: false,
      };
      return CalendarData;
    }

  }

  GetEvaluatedExceptionFlags(): Observable<any> {
    const userData = this.GetUserSession();
    if (isDevMode()) {
      return this.http.get<any>(environment.GetEvaluatedExceptionFlags);
    } else {
      return this.http.get<any>(`${environment.GetEvaluatedExceptionFlags}/${userData.ficha}/${userData.codPuesto}/${this.isUserEvaluated().codCalendario}`);
    }
  }

  GetEvaluatorExceptionFlags(codCalendario: string): Observable<any> {
    const userData = this.GetUserSession();
    if (isDevMode()) {
      return this.http.get<any>(environment.GetEvaluatorExceptionFlags);
    } else {
      return this.http.get<any>(`${environment.GetEvaluatorExceptionFlags}/${userData.ficha}/${userData.codPuesto}/${codCalendario}`);
    }
  }

  GetEvaluatedCalendarCode(): string {
    let EvaluatedCalendarCode: any = this.GetUserSession();
    EvaluatedCalendarCode = EvaluatedCalendarCode.permisos.find((data: { evaluado: boolean; }) => data.evaluado === true);
    if (!EvaluatedCalendarCode || !EvaluatedCalendarCode.evaluado) {
      ////console.log('No se encontró calendario o no está evaluado');
      return "NO SE ENCONTRÓ";
    } else {
      return EvaluatedCalendarCode.calendario;
    }

  }

  GetEvaluatedCalendarType(): string {
    let EvaluatedCalendarCode: any = this.GetUserSession();
    EvaluatedCalendarCode = EvaluatedCalendarCode.permisos.find((data: { evaluado: boolean; }) => data.evaluado === true);
    if (!EvaluatedCalendarCode || !EvaluatedCalendarCode.evaluado) {
      ////console.log('No se encontró calendario o no está evaluado');
      return "NO SE ENCONTRÓ";
    } else {
      return EvaluatedCalendarCode.tipo;
    }
  }

  GetEvaluatorCalendarType(CalendarCode: string): string {
    ////console.log(CalendarCode)
    let EvaluatorCalendarCode: any = this.GetUserSession();
    EvaluatorCalendarCode = EvaluatorCalendarCode.permisos.find((data: { calendario: any; }) => data.calendario === CalendarCode);
    if (!EvaluatorCalendarCode) {
      ////console.log('No se encontró calendario o no está evaluado');
      return "NO SE ENCONTRÓ";
    } else {
      return EvaluatorCalendarCode.tipo;
    }
  }

}
