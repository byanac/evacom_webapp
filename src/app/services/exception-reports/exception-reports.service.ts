import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExceptionReportsService {

  constructor(private http: HttpClient) { }

  GetExceptionReportTypeEvaluationEvaluatedByEvaluator(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetExceptionReportTypeEvaluatedByEvaluator);
    } else {
      return this.http.get(`${environment.GetExceptionReportTypeEvaluatedByEvaluator}/eval/${codPuesto}/${codCalendario}`);
    }
  }

  GetExceptionReportTypeFeedbackEvaluatedByEvaluator(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetExceptionReportTypeFeedbackEvaluatedByEvaluator);
    } else {
      return this.http.get(`${environment.GetExceptionReportTypeEvaluatedByEvaluator}/retroalimentacion/${codPuesto}/${codCalendario}`);
    }
  }

  GetExceptionReportTypePIDEvaluatedByEvaluator(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetExceptionReportTypePIDEvaluatedByEvaluator);
    } else {
      return this.http.get(`${environment.GetExceptionReportTypeEvaluatedByEvaluator}/PID_EST/${codPuesto}/${codCalendario}`);
    }
  }

  GetExceptionReportTypePIDCOMPLIANCEEvaluatedByEvaluator(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetExceptionReportTypeEvaluatedByEvaluator);
    } else {
      return this.http.get(`${environment.GetExceptionReportTypeEvaluatedByEvaluator}/PID_EVAL/${codPuesto}/${codCalendario}`);
    }
  }
}
