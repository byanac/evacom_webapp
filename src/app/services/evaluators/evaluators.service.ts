import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvaluatorsService {

  constructor(private http: HttpClient) { }

  getEvaluatorsReport(RequestBody: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetEvaluatorsReport);
    } else {
      return this.http.post(`${environment.GetEvaluatorsReport}`, RequestBody);
    }
  }

  getWorkersfromEvaluatorReport(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetWorkersFromEvaluatorReport);
    } else {
      return this.http.get(`${environment.GetWorkersFromEvaluatorReport}/${codPuesto}/${codCalendario}`);
    }
  }

  GetFinishedEvaluatorsEvaluations(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetFinishedEvaluatorsEvaluations);
    } else {
      return this.http.get(`${environment.GetFinishedEvaluatorsEvaluations}/${codPuesto}/${codCalendario}`);
    }
  }
}
