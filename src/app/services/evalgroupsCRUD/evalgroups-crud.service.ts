import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvalgroupsCRUDService {

  constructor(private http: HttpClient) { }

  GetEvalGroupsReportCRUD(): Observable<any> {
    return this.http.get<any>(environment.GetEvalGroupsReportCRUD);
  }

  PostEvalGroupsCRUD(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.PostEvalGroupsCRUD,ResponseBody);
  }

  PutEvalGroupsCRUD(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.PutEvalGroupsCRUD,ResponseBody);
  }

  GetEvalGroupsDetailReportCRUD(): Observable<any> {
    return this.http.get<any>(environment.GetEvalGroupsDetailReportCRUD);
  }

  PostEvalGroupsDetailCRUD(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.PostEvalGroupsDetailCRUD,ResponseBody);
  }

  PutEvalGroupsDetailCRUD(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.PutEvalGroupsDetailCRUD,ResponseBody);
  }

  /*INI PROY-00013 RFC*/
  GetUnidadOrganizativa(): Observable<any> {
    return this.http.get<any>(environment.GetUnidadOrganizativa);
  }
  /*FIN PROY-00013 RFC*/
}
