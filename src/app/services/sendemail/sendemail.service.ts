import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SendemailService {
  constructor(private http: HttpClient) { }

  sendKnowledgeEmail(codCalendar: string, codPuesto: string, codFicha:string){
    return this.http.get(`${environment.EmailConocimientoAPI}/${codCalendar}/${codPuesto}/${codFicha}`);
  }

  sendAutoEvaluationEmail(codCalendar: string, codPuesto: string, codFicha:string){
    return this.http.get(`${environment.EmailAutoEvaluacionAPI}/${codCalendar}/${codPuesto}/${codFicha}`);
  }


  sendEvaluatorEmail(codCalendar: string, codPuesto: string, codFicha:string){
    return this.http.get(`${environment.EmailEvaluacionAPI}/${codCalendar}/${codPuesto}/${codFicha}`);
  }

  
}
