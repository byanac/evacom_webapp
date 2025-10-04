import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { IMembers } from 'src/app/interfaces/IMembers';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvalasignationService {

  constructor(private http: HttpClient) { }

  GetEvalAsignationReport(CalendarId: string): Observable<any> {
    if(isDevMode()){
      return this.http.get<any>(environment.GetEvalAsignationReport);
    }else{
      return this.http.get<any>(`${environment.GetEvalAsignationReport}/${CalendarId}`);
    }
  }

  GetWorkerDataFromPositionCode(WorkerPositionCode: string): Observable<any> {
    if(isDevMode()){
      return this.http.get<any>(environment.GetWorkerDataFromPositionCode);
    }else{
      return this.http.get<any>(`${environment.GetWorkerDataFromPositionCode}/${WorkerPositionCode}`);
    }

  }

  PostEvalAsignationReport(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.PostPutEvalAsignationReport,ResponseBody);
  }

  /*INI PROY-00013*/
  PostPutCargaAutomaticaEvalAsignationReport(codCalendario:string,codFichaAdmin:string,codPuestoEvaluador:string,miembros: any) {
    debugger
    return this.http.post<any>(`${environment.PostPutCargaAutomaticaEvalAsignationReport}/${codCalendario}/${codFichaAdmin}/${codPuestoEvaluador}`, miembros);
  }

  validarDataCargaAutomaticaEvalAsignationReport(miembros: IMembers[],codGrupoEval:string,codCalendario:string,codFichaAdmin:string) {
    return this.http.post<any>(`${environment.validarDataCargaAutomaticaEvalAsignationReport}/${codGrupoEval}/${codCalendario}/${codFichaAdmin}`, miembros);
  }
  /*FIN PROY-00013*/

  PutEvalAsignationReports(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.PostPutEvalAsignationReport,ResponseBody);
  }

  PostEvalAsignation180(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.PostPutEvalAsignation180,ResponseBody);
  }

  PutEvalAsignation180(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.PostPutEvalAsignation180,ResponseBody);
  }

  PostSendEvalAsignationExcelForValidation(file: File): Observable<any> {
    if(isDevMode()){
      return this.http.get(environment.PostSendEvalAsignationExcelForValidation);
    }else{
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);
      return this.http.post(`${environment.PostSendEvalAsignationExcelForValidation}`, formData);
    }
  }

  PostSendEvalAsignationExcelForSave(BodyToSend: any, FichaAdmin: string): Observable<any>{
    return this.http.post(`${environment.PostSendEvalAsignationExcelForSave}/${FichaAdmin}`, BodyToSend)
  }
}
