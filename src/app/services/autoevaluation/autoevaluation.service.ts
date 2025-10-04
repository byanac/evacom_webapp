import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { IAutoEvalReport } from 'src/app/interfaces/IAutoEvalReport';

@Injectable({
  providedIn: 'root'
})
export class AutoevaluationService {

  constructor(private http: HttpClient) { }

  getAutoEvalReport(BodyToSend: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<IAutoEvalReport>(environment.AutoEvalReportAPI);
    } else {
      return this.http.post<IAutoEvalReport>(`${environment.AutoEvalReportAPI}`, BodyToSend); 
    } 
  }

  GetAutoEvalProgression(CodFicha: string, CodPuesto: string): Observable<IAutoEvaluationResult> {
    if (isDevMode()) {
      return this.http.get<IAutoEvaluationResult>(environment.GetAutoEvalProgression);
    } else {
      return this.http.get<IAutoEvaluationResult>(`${environment.GetAutoEvalProgression}/${CodFicha}/${CodPuesto}`);
    }
  }

  PostAutoEvalProgression(CodCalendario: string,CodFicha: string, CodPuesto: string, BodyToSend: any): Observable<any> {
    return this.http.post<any>(`${environment.GetAutoEvalProgression}/${CodCalendario}/${CodFicha}/${CodPuesto}`, BodyToSend);
  }
}
