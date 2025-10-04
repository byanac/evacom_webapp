import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { IPIDIndicatorsAndDeliverables } from 'src/app/interfaces/IPIDIndicatorsAndDeliverables';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PidService {
  $EvaluatedPIDAccess = new EventEmitter<boolean>(false);
  
  constructor(private http: HttpClient) { }

  GetIndicatorsListForMultiselect(): Observable <IPIDIndicatorsAndDeliverables> {
    if (isDevMode()) {
      return this.http.get<IPIDIndicatorsAndDeliverables>(environment.GetIndicatorsListForMultiselect); 
    } else {
      return this.http.get<IPIDIndicatorsAndDeliverables>(environment.GetIndicatorsListForMultiselect); 
    }
  }   

  GetDeliverablesListForMultiselect(): Observable <IPIDIndicatorsAndDeliverables> {
    if (isDevMode()) {
      return this.http.get<IPIDIndicatorsAndDeliverables>(environment.GetDeliverablesListForMultiselect); 
      } else {
      return this.http.get<IPIDIndicatorsAndDeliverables>(environment.GetDeliverablesListForMultiselect);     
    }
  }   

  GetCompetenciesForSelect(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetCompetenciesForSelect); 
      } else {
      return this.http.get<any>(`${environment.GetCompetenciesForSelect}/${codPuesto}/${codCalendario}`);     
    }
  }  

  GetPIDandCompliancePIDReportfromEvaluator(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetPIDandCompliancePIDReportfromEvaluator); 
      } else {
      return this.http.get<any>(`${environment.GetPIDandCompliancePIDReportfromEvaluator}/${codPuesto}/${codCalendario}`);  
    }
  }   

  GetAdminPIDandCompliancePIDReport(PostBody: any): Observable <any> {
      if (isDevMode()) {
        return this.http.get<any>(environment.GetPidAdminReport); 
        } else {
        return this.http.post<any>(environment.GetPidAdminReport, PostBody);  
      }
  }   

  GetEvaluatedPIDTable(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetEvaluatedPIDTable); 
      } else {
      return this.http.get<any>(`${environment.GetEvaluatedPIDTable}/${codPuesto}/${codCalendario}`);  
    }
  }   

  SavePidForEvaluated(fichaEvaluador:string,fichaEvaluado:string,codCalendario: string, PostBody: any): Observable <any> {
    if (isDevMode()) {
      return this.http.post<any>(`${environment.PostSaveEvaluatorPID}/${fichaEvaluador}/${fichaEvaluado}/${codCalendario}`,PostBody);  
      } else {
      return this.http.post<any>(`${environment.PostSaveEvaluatorPID}/${fichaEvaluador}/${fichaEvaluado}/${codCalendario}`,PostBody);  
    }
  }

  SaveEvaluatorVerdictPID(fichaEvaluador: string, fichaEvaluado:string,codCalendario: string, PostBody: any): Observable <any> {
      return this.http.post<any>(`${environment.SaveEvaluatorVerdictPID}/${fichaEvaluador}/${fichaEvaluado}/${codCalendario}`,PostBody);  
  }

  SaveEvaluatorVerdictCompliancePID(fichaEvaluador: string, fichaEvaluado:string,codCalendario: string, PostBody: any): Observable <any> {
    return this.http.post<any>(`${environment.SaveEvaluatorVerdictCompliancePID}/${fichaEvaluador}/${fichaEvaluado}/${codCalendario}`,PostBody);  
}


  PutEvaluatedComplianceUploadFile(DetalleID: number,file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post(`${environment.PutEvaluatedComplianceUploadFile}/${DetalleID}`, formData);
  }

  SendPIDEvaluatedNotification(CodFichaEvaluado: string, CodCalendario: string): Observable <any> {
    return this.http.get<any>(`${environment.SendPIDEvaluatedNotification}/${CodFichaEvaluado}/${CodCalendario}`);  
  }

  SendPIDEvaluatorNotification(CodFichaEvaluado: string, CodCalendario: string): Observable <any> {
    return this.http.get<any>(`${environment.SendPIDEvaluatorNotification}/${CodFichaEvaluado}/${CodCalendario}`);  
  }

  PIDGetDeliverables(): Observable <any> {
    return this.http.get<any>(environment.GetDeliverablesListForMultiselect);  
  }

  PIDGetIndicators(): Observable <any> {
    return this.http.get<any>(environment.GetIndicatorsListForMultiselect);  
  }

  PIDCreateUpdateDeleteConstants(PostBody: any): Observable <any> {
    return this.http.post<any>(environment.PIDCreateUpdateDeleteConstants,PostBody);  
  }

  GetPIDEvaluatedValidation(codFichaEvaluado: string, codPuestoEvaluado: string, CodCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetPIDEvaluatedValidation); 
      } else {
        return this.http.get<any>(`${environment.GetPIDEvaluatedValidation}/${codFichaEvaluado}/${codPuestoEvaluado}/${CodCalendario}`);
    }
  }
}
