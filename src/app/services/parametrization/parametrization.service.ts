import { HttpClient } from '@angular/common/http';
import {  Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ParametrizationService {

  constructor(private http: HttpClient) { }

  GetParametrizationProgress(codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetParametrizationProgress);
    } else {
      return this.http.get<any>(`${environment.GetParametrizationProgress}/${codCalendario}`);
    }
  }    

}
