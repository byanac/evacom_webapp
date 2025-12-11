import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IReporteGlobal } from '../../interfaces/IReporteGlobal';

@Injectable({
  providedIn: 'root'
})
export class ReporteDataService {

  private reporteSource = new BehaviorSubject<IReporteGlobal>({
    calendarioCodigo: '',
    calendarioTipo: '',
    registros: []
  });

  currentReporte: Observable<IReporteGlobal> = this.reporteSource.asObservable();

  
  constructor() { }

  setReporteGlobal(data: IReporteGlobal) {
    this.reporteSource.next(data);
  }
  
}
