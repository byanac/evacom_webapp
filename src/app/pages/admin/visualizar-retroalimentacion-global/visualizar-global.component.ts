import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IReporteGlobal, registroEvaluados } from 'src/app/interfaces/IReporteGlobal';
import { ReporteDataService } from 'src/app/services/ReporteDataServiceService/reporte-data-service.service';

@Component({
  selector: 'app-visualizar-global',
  templateUrl: './visualizar-global.component.html',
  styleUrls: ['./visualizar-global.component.css']
})
export class VisualizarGlobalComponent implements OnInit {


  reporteGlobal!: IReporteGlobal; 
  registrosTabla: registroEvaluados[] = []; // Array para la tabla
  private subscription!: Subscription;
  
  constructor(private reporteDataService: ReporteDataService) { }

  ngOnInit() {
    const dataRaw = sessionStorage.getItem('reporte_global');
    if (dataRaw) {
    const reporte: IReporteGlobal = JSON.parse(dataRaw);
    this.reporteGlobal = reporte;
   
      }

  }

   PrintButton(){
    window.print();
  }
}
