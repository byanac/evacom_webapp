import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  $CurrentCalendarData = new EventEmitter<any>()

  constructor(private http: HttpClient) { }

  getDataScheduleApi(): Observable <any> {
    return this.http.get<ISchedule>(environment.CalendarAPI)
  }


  GetCalendarName(CalendarCode: string): Promise<string> {
    return this.getDataScheduleApi().toPromise().then(data => {
      const calendarName = data.registros.find((data: { vCodigo: string; }) => data.vCodigo === CalendarCode).vNombre;
      if (calendarName === undefined) {
        return "NO SE ENCONTRÓ";
      } else {
        return calendarName;
      }
    });
  }

  GetCalendarTypeNumber(CalendarCode: string): Promise<string> {
    return this.getDataScheduleApi().toPromise().then(data => {
      const calendarTypeNumber = data.registros.find((data: { vCodigo: string; }) => data.vCodigo === CalendarCode);
      if (calendarTypeNumber === undefined) {
        return "NO SE ENCONTRÓ";
      } else {
        return calendarTypeNumber.tipo;
      }
    });
  }


  VerifyPeriodRangedDates(PeriodStartDate: string, PeriodEndDate: string): boolean{
    const fechaActual = new Date(); 
    const fechaInicio = new Date(`${PeriodStartDate}T00:00:00`);
    const fechaFin = new Date(`${PeriodEndDate}T00:00:00`);

    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      return false;
    }

    return fechaActual >= fechaInicio && fechaActual <= fechaFin;
  }


  getCalendarVigencies(): Observable <any> {
      return this.http.get<any>(environment.getCalendarVigencies);
  }

  GetCalendarPeriodicities(): Observable <any> {
    return this.http.get<any>(environment.GetPeriodicity);
  }

  PostInsertCalendar(BodyToSend: any): Observable <any> {
    return this.http.post<any>(environment.PostInsertCalendar,BodyToSend);
  }

  PutUpdateCalendar(BodyToSend: any): Observable <any> {
    return this.http.put<any>(environment.PostInsertCalendar,BodyToSend);
  }
}
