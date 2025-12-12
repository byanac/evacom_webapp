import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchStateService {

  private state = {
    ficha: '',
    puesto: '',
    periodo: '',
    gerencias: [],
    equipos: []
  };

  setState(data: any) {
    this.state = {...this.state, ...data};
  }

  getState() {
    return this.state;
  }

  clearState() {
    this.state = {
      ficha: '',
      puesto: '',
      periodo: '',
      gerencias: [],
      equipos: []
    };
  }
}
