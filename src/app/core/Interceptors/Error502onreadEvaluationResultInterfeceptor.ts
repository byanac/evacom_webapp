import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor( private router: Router){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 502) {
          ////console.log('Error 502: Bad Gateway', error.message);
          Swal.fire('ERROR','Hubo un error inesperado.','error').then(() =>{
            return this.router.navigateByUrl('/home');
          })
        }
        // Manejar otros errores
        return throwError(error);
      })
    );
  }
}
