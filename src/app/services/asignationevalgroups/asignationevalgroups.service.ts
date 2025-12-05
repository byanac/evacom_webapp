import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import {IMembers} from 'src/app/interfaces/IMembers'

@Injectable({
  providedIn: 'root'
})
export class AsignationevalgroupsService {

  constructor(private http: HttpClient) { }

  GetAsignationEvalsGroupsReport(CalendarId: string): Observable<any> {
    if(isDevMode()){
      return this.http.get<any>(environment.GetAsignationGroupsReport);
    }else{
      return this.http.get<any>(`${environment.GetAsignationGroupsReport}/${CalendarId}`);
    }
  }

  GetWorkerDataFromPositionCode(WorkerPositionCode: string): Observable<any> {
    if(isDevMode()){
      return this.http.get<any>(environment.GetWorkerDataFromPositionCode);
    }else{
      return this.http.get<any>(`${environment.GetWorkerDataFromPositionCode}/${WorkerPositionCode}`);
    }

  }

  PostAsignationEvalsGroups(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.PostPutAsignationGroupsReport,ResponseBody);
  }

  PutAsignationEvalsGroups(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.PostPutAsignationGroupsReport,ResponseBody);
  }

  /*INI PROY-00013 RFC*/  
  UpdateDirectorioFicha(ficha:string): Observable<any> {
    return this.http.post<any>(`${environment.UpdateDirectorioFicha}/${ficha}`, {});
  }
  /*FIN PROY-00013*/


  PostSendAsignationEvalsGroupsExcelForValidation(file: File,codigoCalendario:string): Observable<any> {
    if(isDevMode()){
      return this.http.get(environment.PostSendAsignationGroupsExcelForValidation);
    }else{
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      formData.append('codCalendario',codigoCalendario);
      return this.http.post(`${environment.PostSendAsignationGroupsExcelForValidation}`, formData);
    }
  }

  PostSendAsignationEvalsGroupsExcelForSave(BodyToSend: any, FichaAdmin:string): Observable<any>{
    return this.http.post(`${environment.PostSendAsignationGroupsExcelForSave}/${FichaAdmin}`, BodyToSend)
  }

  /*INI PROY-00013 RFC*/
  PostAsignationCargaAutomaticaEvalsGroups(miembros: any,codGrupoEval:string,codCalendario:string,codFichaAdmin:string) {
    return this.http.post<any>(`${environment.PostPutCargaAutomaticaAsignationGroupsReport}/${codGrupoEval}/${codCalendario}/${codFichaAdmin}`, miembros);
  }

  validarDataCargaAutomaticaEvalsGroups(miembros: IMembers[],codGrupoEval:string,codCalendario:string,codFichaAdmin:string) {
    return this.http.post<any>(`${environment.validarDataCargaAutomaticaEvalsGroups}/${codGrupoEval}/${codCalendario}/${codFichaAdmin}`, miembros);
  }
    /*FIN PROY-00013 RFC*/
}
