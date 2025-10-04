import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) { }

  GetAdminsReport(): Observable<any> {
    return this.http.get<any>(environment.GetAdminReport);
  }

  GetWorkerInfoForRegisterAdminModal(codFicha: string): Observable<any> {
    if(isDevMode()){
      return this.http.get<any>(`${environment.GetWorkerInfoForRegisterAdminModal}`);  
    }else{
      return this.http.get<any>(`${environment.GetWorkerInfoForRegisterAdminModal}/${codFicha}`);  
    }
  }

  GetAdminInfo(codFicha: string): Observable<any> {
    if(isDevMode()){
      return this.http.get<any>(`${environment.GetAdminInfo}`);  
    }else{
      return this.http.get<any>(`${environment.GetAdminInfo}/${codFicha}`);  
    }
  }

  PostSaveAdmin(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.PostSaveAdmin, ResponseBody);
  }

  PutSaveAdmin(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.PutUpdateAdmin, ResponseBody);
  }

  /*INI PROY-00013*/
  getMembersTeam(): Observable<any> {
    return this.http.get<any>(`${environment.getMembersTeam}`);  
  }

  getMembersByTeam(codigoEquipo: string): Observable<any> {
    return this.http.get<any>(`${environment.GetMemberByTeam}/${codigoEquipo}`);  
  }
  /*FIN PROY-00013*/
}
