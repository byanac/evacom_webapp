import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { ITeam } from 'src/app/interfaces/ITeam';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  getDataTeamApi(gerencybody: any): Observable <ITeam> {
    if (isDevMode()) {
      return this.http.get<any>(environment.TeamAPI);
    } else {
      return this.http.post<ITeam>(environment.TeamAPI, gerencybody)
    }
  }

  /*INI PROY-00013*/
  
  UpdateTeamAPI(): Observable <ITeam> {
    return this.http.get<ITeam>(environment.UpdateTeamAPI)
  }
  /*FIN PROY-00013*/
  
}
