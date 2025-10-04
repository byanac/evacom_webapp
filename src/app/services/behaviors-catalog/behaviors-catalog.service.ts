import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BehaviorsCatalogService {
  constructor(private http: HttpClient) { }

  GetCompetenciesGroupReport(): Observable<any> {
    return this.http.get<any>(environment.GetCompetenciesGroupReport);
  }

  PostCompetenciesGroup(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.GetCompetenciesGroupReport,ResponseBody);
  }

  PutCompetenciesGroup(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.GetCompetenciesGroupReport,ResponseBody);
  }

  GetCompetenciesReport(): Observable<any> {
    return this.http.get<any>(environment.GetCompetenciesReport);
  }

  PostCompetencies(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.GetCompetenciesReport,ResponseBody);
  }

  PutCompetencies(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.GetCompetenciesReport,ResponseBody);
  }

  PostSendCompetenciesExcelForValidation(file: File): Observable<any> {
    if(isDevMode()){
      return this.http.get(environment.PostSendCompetenciesExcelForValidation);
    }else{
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      return this.http.post(`${environment.PostSendCompetenciesExcelForValidation}`, formData);
    }
  }

  PostSendCompetenciesExcelForSave(BodyToSend: any, FichaAdmin: string): Observable<any>{
    return this.http.post(`${environment.PostSendCompetenciesExcelForSave}/${FichaAdmin}`, BodyToSend)
  }

  GetLevelsReport(): Observable<any> {
    return this.http.get<any>(environment.GetLevelsReport);
  }

  PostLevels(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.GetLevelsReport,ResponseBody);
  }

  PutLevels(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.GetLevelsReport,ResponseBody);
  }

  GetBehaviorsReport(): Observable<any> {
    return this.http.get<any>(environment.GetBehaviorsReport);
  }

  PostBehaviorsReport(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.GetBehaviorsReport,ResponseBody);
  }

  PutBehaviorsReport(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.GetBehaviorsReport,ResponseBody);
  }

  PostSendBehaviorsExcelForValidation(file: File): Observable<any> {
    if(isDevMode()){
      return this.http.get(environment.PostSendBehaviorsExcelForValidation);
    }else{
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      return this.http.post(`${environment.PostSendBehaviorsExcelForValidation}`, formData);
    }
  }

  PostSendBehaviorsExcelForSave(BodyToSend: any, FichaAdmin: string): Observable<any>{
    return this.http.post(`${environment.PostSendBehaviorsExcelForSave}/${FichaAdmin}`, BodyToSend)
  }

}
