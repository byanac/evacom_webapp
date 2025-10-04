import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem("token");
    //////console.log('Valor del token: ', token)

    let modifiedRequest = request;
    if (token) {
     // ////console.log('Helper funcionando')
      modifiedRequest = request.clone({
        setHeaders: {
          'Authorization': `Bearer ${token}`
        }
      });
     //////console.log(modifiedRequest.headers)
    }

    return next.handle(modifiedRequest);
  }
}