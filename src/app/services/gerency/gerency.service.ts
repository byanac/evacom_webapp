import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGerency } from 'src/app/interfaces/IGerency';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GerencyService {

  constructor(private http: HttpClient) { }

  getDataGerencyApi(): Observable <IGerency> {
    return this.http.get<IGerency>(environment.GerencyAPI)
  }

  /*INI PROY-00013*/
  UpdateGerencyAPI(): Observable <IGerency> {
    return this.http.get<IGerency>(environment.UpdateGerencyAPI)
  }
  /*FIN PROY-00013*/
  
}
