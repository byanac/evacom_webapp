import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAddoutstandingfact } from 'src/app/interfaces/IAddoutstandingfact';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';

@Injectable({
  providedIn: 'root'
})
export class AddoutstandingfactmodalService {
  $modal = new EventEmitter<boolean>()
  $name = new EventEmitter<string>()

  constructor(private http: HttpClient) {
    this.$modal.emit(false);
   }

   SaveWorkerOutStandingFact(PostBody: IAddoutstandingfact): Observable<any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.PostSaveOutStandingFactForWorker);
    } else {
      return this.http.post<any>(`${environment.PostSaveOutStandingFactForWorker}`,PostBody);
    }
  }

  GetOutStandingFactsFromWorker(codFicha: string): Observable <any>{
    if (isDevMode()) {
      return this.http.get<IAutoEvaluationResult>(environment.GetOutStandingFactsFromWorker);
    } else {
      return this.http.get<IAutoEvaluationResult>(`${environment.GetOutStandingFactsFromWorker}/${codFicha}`);
    }
  }

  PostHistoricEvaluatorsFactsReport(PostBody: IAddoutstandingfact): Observable<any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.PostEvaluatorsFactsReport);
    } else {
      return this.http.post<any>(`${environment.PostEvaluatorsFactsReport}`,PostBody);
    }
  }

  GetHistoricEvalutedsByEvaluatorReport(codPuesto: string, codCalendario: string): Observable<any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetHistoricEvalutedsByEvaluatorReport);
    } else {
      return this.http.get<any>(`${environment.GetHistoricEvalutedsByEvaluatorReport}/${codPuesto}/${codCalendario}`);
    }
  }

  GetHistoricOutStandingFactsFromWorker(codFicha: string,codCalendario: string): Observable <any>{
    if (isDevMode()) {
      return this.http.get<IAutoEvaluationResult>(environment.GetOutStandingFactsFromWorker);
    } else {
      return this.http.get<IAutoEvaluationResult>(`${environment.GetOutStandingFactsFromWorker}/${codFicha}/${codCalendario}`);
    }
  }
}
