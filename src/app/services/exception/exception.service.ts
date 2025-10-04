import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExceptionService {

  constructor(private http: HttpClient) { }

  GetWorkerForException(tipoExcepcion: string,codFicha: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetWorkerForException);
    } else {
      return this.http.get(`${environment.GetWorkerForException}/${tipoExcepcion}/${codFicha}/${codCalendario}`);
    }
  }

  GetWorkerForExceptionFindByTeam(tipoExcepcion: string, codEquipo: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetWorkerForExceptionFindByTeam);
    } else {
      return this.http.get(`${environment.GetWorkerForExceptionFindByTeam}/${tipoExcepcion}/${codEquipo}/${codCalendario}`);
    }
  }

  GetOrganicUnitsForException(): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetOrganicUnitsForException);
    } else {
      return this.http.get(`${environment.GetOrganicUnitsForException}`);
    }
  }

  PostSaveAndSendWorkersForException(BodyToSend: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.PostSaveAndSendWorkersForException);
    } else {
      return this.http.post(`${environment.PostSaveAndSendWorkersForException}`,BodyToSend);
    }
  }

  PostUpdateExceptionLimitDate(BodyToSend: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.PostUpdateExceptionLimitDate);
    } else {
      return this.http.post(`${environment.PostUpdateExceptionLimitDate}`,BodyToSend);
    }
  }

  
  GetAdminExceptionReports(BodyToSend: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetAdminExceptionReports);
    } else {
      return this.http.post(`${environment.GetAdminExceptionReports}`,BodyToSend);
    }
  }
}
