import { Directive } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Directive({
  selector: '[appExpirationTokenInterceptor]'
})
export class ExpirationTokenInterceptorDirective implements HttpInterceptor {

  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error('El token ha expirado.');
          Swal.fire('Sesión expirada', 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.', 'info').then(() => {
            this.router.navigateByUrl('/login');
          })
        }
        return throwError(error);
      })
    );
  }
}