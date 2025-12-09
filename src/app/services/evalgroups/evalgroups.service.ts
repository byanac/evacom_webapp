import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IEvaluationGroup } from 'src/app/interfaces/IEvaluationGroup';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvalgroupsService {
  constructor(private http: HttpClient) { }

  getEvaluationGroup(): Observable<any> {
    return this.http.get<IEvaluationGroup>(environment.EvalGroupAPI);
  }
    
  getEvaluationGroupByPuesto(codigoCalendario: string, codigoPuesto: string): Observable<any> {
    const url = `${environment.EvalGroupAPI}${codigoCalendario}/${codigoPuesto}`;
    return this.http.get<IEvaluationGroup>(url);
  }

  getEvaluationsGroups(): Observable<any> {
    return this.http.get<IEvaluationGroup>(environment.EvalsGroupsAPI);
  }

  getEvaluationsGroupsReport(ResponseBody: any): Observable<any> {
    return this.http.post<IEvaluationGroup>(environment.GetEvalGroupAPI, ResponseBody);
  }


}
