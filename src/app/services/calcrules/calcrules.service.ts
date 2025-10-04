import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalcrulesService {
  constructor(private http: HttpClient) { }

  GetCalendarDataForCalcRules(CalendarId: string): Observable<any> {
    if(isDevMode()){
      return this.http.get<any>(environment.GetCalendarDataForCalcRules);
    }else{
      return this.http.get<any>(`${environment.GetCalendarDataForCalcRules}/${CalendarId}`);
    }
  }

  PostCalendarDataForCalcRules(ResponseBody: any): Observable<any> {
    return this.http.post<any>(environment.PostCalendarDataForCalcRules,ResponseBody);
  }

  PutCalendarDataForCalcRules(ResponseBody: any): Observable<any> {
    return this.http.put<any>(environment.PutCalendarDataForCalcRules,ResponseBody);
  }
  
}
