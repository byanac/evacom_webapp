import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { ICalibrationFindEvaluatedByFicha } from 'src/app/interfaces/ICalibrationFindEvaluatedByFicha';
import { ICalibrationGetEvaluatedReport } from 'src/app/interfaces/ICalibrationGetEvaluatedReport';
import { ICalibrationSendEvaluatedForAutorization } from 'src/app/interfaces/ICalibrationSendEvaluatedForAutorization';


@Injectable({
  providedIn: 'root'
})
export class CalibrationService {

  constructor(private http: HttpClient) {}

  GetEvaluatedByFolder(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<ICalibrationFindEvaluatedByFicha>(environment.GetEvaluatedByFichaForCalibration); 
    } else {
      return this.http.get<ICalibrationFindEvaluatedByFicha>(`${environment.GetEvaluatedByFichaForCalibration}/${codPuesto}/${codCalendario}`); 
    }
  }   

  GetCalibrationReport(codCalendario: string): Observable <ICalibrationGetEvaluatedReport> {
    if (isDevMode()) {
      return this.http.get<ICalibrationGetEvaluatedReport>(environment.GetCalibrationEvaluatedReport); 
      } else {
      return this.http.get<ICalibrationGetEvaluatedReport>(`${environment.GetCalibrationEvaluatedReport}/${codCalendario}`);    
    }
  }   

  GetEvaluatedCalibration90(IdEvaluation: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<ICalibrationGetEvaluatedReport>(environment.GetCalibrationFromEvaluated90); 
      } else {
      return this.http.get<ICalibrationGetEvaluatedReport>(`${environment.GetCalibrationFromEvaluated90}/${IdEvaluation}`);    
    }
  }  

  GetEvaluatedCalibration180(IdEvaluation: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<ICalibrationGetEvaluatedReport>(environment.GetCalibrationFromEvaluated180); 
      } else {
      return this.http.get<ICalibrationGetEvaluatedReport>(`${environment.GetCalibrationFromEvaluated180}/${IdEvaluation}`);   
    }
  }  

  PostSendEvaluatedForCalibrationAutorization(PostBody: ICalibrationSendEvaluatedForAutorization): Observable <any> {
      return this.http.post<any>(environment.PostSaveCalibration,PostBody); 
  }  

  GetSendEvaluatorNotification(idCalibracion: number): Observable <any> {
    return this.http.get<any>(`${environment.GetSendEvaluatorNotification}/${idCalibracion}`); 
  }  

  PostChangeEvaluatedCalibrationPeriodDate(PostBody: any): Observable<any>{
    return this.http.post<any>(environment.PostChangeEvaluatedCalibrationPeriodDate,PostBody); 
  }

  GetHistoricEvaluatedFirstEvaluation90(codFicha: string, codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<ICalibrationGetEvaluatedReport>(environment.GetHistoricEvaluatedFirstEvaluation90); 
      } else {
      return this.http.get<ICalibrationGetEvaluatedReport>(`${environment.GetHistoricEvaluatedFirstEvaluation90}/${codFicha}/${codPuesto}/${codCalendario}`);    
    }
  }  

  GetHistoricEvaluatedFirstEvaluation180(EvaluadocodFicha: string, EvaluadocodPuesto: string,codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<ICalibrationGetEvaluatedReport>(environment.GetHistoricEvaluatedFirstEvaluation180); 
      } else {
      return this.http.get<ICalibrationGetEvaluatedReport>(`${environment.GetHistoricEvaluatedFirstEvaluation180}/${EvaluadocodFicha}/${EvaluadocodPuesto}/${codCalendario}`);     
    }
  }  
}
