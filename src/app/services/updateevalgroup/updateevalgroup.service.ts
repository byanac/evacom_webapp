import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UpdateevalgroupService{
  $modal = new EventEmitter<boolean>()
  $reloadDataOnTable = new EventEmitter<boolean>()
  
  constructor(private http: HttpClient) { }
  
  getEvalGroupReport(RequestBody: any): Observable <any> {
    if (isDevMode()) {
      return this.http.get<any>(environment.GetEvalGroupAPI);
    } else {
      return this.http.post(`${environment.GetEvalGroupAPI}`, RequestBody);
    }
  }

  postUpdateEvalGroup(codCalendar: string, codPuesto: string, codNuevoGrupoEval: string): Observable <any> {
      return this.http.post(`${environment.UpdateEvalGroup}/${codCalendar}/${codPuesto}/${codNuevoGrupoEval}`, null);
    
  }
}
