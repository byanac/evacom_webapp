import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { environment } from 'src/environments/environment';
import { CalendarService } from '../calendar/calendar.service';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopletobeevaluatedService {
  $CalendarType = new EventEmitter<string>();

  constructor(private http: HttpClient,private calendarService: CalendarService) { }

  GetWorkersList(codPuesto: string, codCalendario: string): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetPeopleToBeEvaluated);
    } else {
      return this.http.get<any>(`${environment.GetPeopleToBeEvaluated}/${codPuesto}/${codCalendario}`);
    }
  }    

  GetWorkerData(
    TcodPuesto: string,
    TcodFicha: string,
    EcodPuesto: string,
    EcodFicha: string,
    codCalendario: string
  ): Observable<IAutoEvaluationResult> {
    if (isDevMode()) {
      return this.http.get<IAutoEvaluationResult>(environment.GetWorkerEvaluationData);
    } else {
      return this.calendarService.getCalendarVigencies().pipe(
        map((CalendarData: any) => {
          const CalendarString = CalendarData.registros.filter(
            (data: { vCodigo: string }) => data.vCodigo === codCalendario
          );
          const CalendarType = CalendarString[0].tipo;
          return CalendarType;
        }),
        switchMap((CalendarType: string) => {
          if (CalendarType === '90') {
            //console.log('90');
            return this.http.get<IAutoEvaluationResult>(
              `${environment.GetWorkerEvaluationData}/${TcodPuesto}/${TcodFicha}/${codCalendario}`
            );
          } else {
            //console.log('180');
            return this.http.get<IAutoEvaluationResult>(
              `${environment.GetWorkerEvaluationData}/${TcodPuesto}/${TcodFicha}/${EcodPuesto}/${EcodFicha}/${codCalendario}`
            );
          }
        })
      );
    }
  }

  SaveWorkerData(codCalendario: string, EcodFicha: string, EcodPuesto: string, BodyPost): Observable <IAutoEvaluationResult> {
    if (isDevMode()) {
      return this.http.get<IAutoEvaluationResult>(environment.SaveWorkerEvaluationData);
    } else {
      return this.http.post<IAutoEvaluationResult>(`${environment.SaveWorkerEvaluationData}/${codCalendario}/${EcodFicha}/${EcodPuesto}`,BodyPost);
    }
  }

  SaveWorkerData180(codCalendario: string, EcodFicha: string, EcodPuesto: string, BodyPost): Observable <IAutoEvaluationResult> {
    if (isDevMode()) {
      return this.http.get<IAutoEvaluationResult>(environment.SaveWorkerEvaluationData);
    } else {
      return this.http.post<IAutoEvaluationResult>(`${environment.SaveWorkerEvaluationData}/save180/${codCalendario}/${EcodFicha}/${EcodPuesto}`,BodyPost);
    }
  }

  async GetWorkersPreEvaluations(calendarType:string, EcodPuesto: string, EcodFicha: string): Promise<Observable <any>> {
    if (isDevMode()) {
      if(calendarType === '90'){
        ////console.log('90')
        return this.http.get<any>(`${environment.GetWorkersPreEvaluations90}`);
      }else if(calendarType === '180'){
        ////console.log('180')
        return this.http.get<any>(`${environment.GetWorkersPreEvaluations180}`);
      }
    } else {
      const data = await this.calendarService.getDataScheduleApi().toPromise();

      const FilterResult = data.registros.filter((data: { tipo: string; }) => data.tipo === calendarType);
      const CalendarCode = FilterResult[0].vCodigo;
      ////console.log(CalendarCode)

      if(calendarType === '90'){
        ////console.log('90')
        return this.http.get<any>(`${environment.GetWorkersPreEvaluations90}/${EcodPuesto}/${CalendarCode}`);
      }else if(calendarType === '180'){
        ////console.log('180')
        return this.http.get<any>(`${environment.GetWorkersPreEvaluations180}/${EcodPuesto}/${EcodFicha}/${CalendarCode}`);
      }
    }

  }
}
