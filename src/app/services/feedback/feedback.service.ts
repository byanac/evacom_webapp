import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http: HttpClient) { }

  PostEvaluatedSaveFeedback(PostBody: any): Observable <any> {
    return this.http.post<any>(environment.PostSaveEvaluatedFeedback,PostBody); 
  }   

  PostEvaluatorSaveFeedback(PostBody: any): Observable <any> {
    return this.http.post<any>(environment.PostSaveEvaluatorFeedback,PostBody); 
  }   

  PostGetEvaluatorsFeedbackProgression(PostBody: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.PostGetEvaluatorsFeedbackProgression); 
    } else {
      return this.http.post<any>(environment.PostGetEvaluatorsFeedbackProgression,PostBody); 
    }
  }  

  GetFeedbackReportfromSelectedEvaluator(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(`${environment.GetFeedbackReportfromSelectedEvaluator}`); 
    } else {
      return this.http.get<any>(`${environment.GetFeedbackReportfromSelectedEvaluator}/${codPuesto}/${codCalendario}`); 
    }
  } 
  
  GetEvaluationGlobal90FromWorker(CodFichaEvaluado: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(`${environment.GetGlobalFeedback90}`); 
    } else {
      return this.http.get<any>(`${environment.GetGlobalFeedback90}/${CodFichaEvaluado}/${codCalendario}`); 
    }
  }

  GetEvaluationGlobal180FromWorker(CodFichaEvaluado: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(`${environment.GetEvaluationGlobal180FromWorker}`); 
    } else {
      return this.http.get<any>(`${environment.GetEvaluationGlobal180FromWorker}/${CodFichaEvaluado}/${codCalendario}`); 
    }
  }

  GetEvaluationsFromEvaluated180(CodFichaEvaluado: string,codPuestoEvaluado: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(`${environment.GetEvaluationsFromEvaluated180}`); 
    } else {
      return this.http.get<any>(`${environment.GetEvaluationsFromEvaluated180}/${CodFichaEvaluado}/${codPuestoEvaluado}/${codCalendario}`); 
    }
  }

  SendEvaluatedForDoFeedback(idEvaluacion: string): Observable <any> {
    return this.http.get<any>(`${environment.SendEvaluatedForDoFeedback}/${idEvaluacion}`); 
}  

  SendEvaluatorForDoFeedback(idEvaluacion: string): Observable <any> {
    return this.http.get<any>(`${environment.SendEvaluatorForDoFeedback}/${idEvaluacion}`); 
  }
  
  SendEvaluatorForDoFeedbackEval(fichaEvaluador: string,fichaEvaluado: string, codigoCalendario: string): Observable <any> {
    return this.http.get<any>(`${environment.SendEvaluatorForDoFeedback}/${fichaEvaluador}/${fichaEvaluado}/${codigoCalendario}`); 
  }
  GetFeedbackStatus(IDRetroalimentacion: number): Observable<any>{
    if (isDevMode()) {
      return this.http.get<any>(`${environment.GetFeedbackStatus}`); 
    } else {
      return this.http.get<any>(`${environment.GetFeedbackStatus}/${IDRetroalimentacion}`); 
    }
  }

  PostUpdateFeedbackDates(PostBody: any): Observable<any>{
    if (isDevMode()) {
      return this.http.get<any>(`${environment.PostUpdateFeedbackDates}`); 
    } else {
      return this.http.post<any>(`${environment.PostUpdateFeedbackDates}`,PostBody); 
    }
  }

  GetFeedbackEvaluationID(CodFichaEvaluado: string,CodPuestoEvaluado:string ,CodCalendario:string): Observable<any>{
    if (isDevMode()) {
      return this.http.get<any>(`${environment.GetFeedbackEvaluationID}`); 
    } else {
      return this.http.get<any>(`${environment.GetFeedbackEvaluationID}/${CodFichaEvaluado}/${CodPuestoEvaluado}/${CodCalendario}`); 
    }
   
  }
}
