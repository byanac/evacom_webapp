import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { isDevMode } from '@angular/core';
import { ILoginData } from 'src/app/interfaces/ILoginData';

@Injectable({
  providedIn: 'root'
})
export class KnowledgeService {

  constructor(private http: HttpClient) { }

  async getKnowledgeQuestions(): Promise<Observable <any>> {
    const UserData: ILoginData = JSON.parse(sessionStorage.getItem('userdata')!)

    if (isDevMode()) {
      return this.http.get<any>(environment.KnowledgeQuestionsAPI);
    } else {
      return this.http.get(`${environment.KnowledgeQuestionsAPI}${UserData.codPuesto}/${UserData.ficha}`);
    }
  }

  getKnowledgeReport(RequestBody: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.KnowledgeReportAPI);
    } else {
      return this.http.post(`${environment.KnowledgeReportAPI}`, RequestBody);
    }
  }

  SendConfirmation(codCalendar: string, codPuesto: string, codFicha:string){
    ////console.log(`${environment.KnowledgeQuestionsAPI}${codCalendar}/${codPuesto}/${codFicha}`)
    return this.http.post(`${environment.KnowledgeQuestionsAPI}${codCalendar}/${codPuesto}/${codFicha}`,null);
  }

}
