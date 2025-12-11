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
    this.subscription = this.reporteDataService.currentReporte.subscribe(data => {
      
      // La primera vez recibirá el objeto vacío (inicialización), 
      // y la segunda vez recibirá la data real.
      if (data && data.registros.length > 0) {
        this.reporteGlobal = data;
        this.registrosTabla = data.registros;
        console.log('Reporte Global recibido. Total de registros:', this.registrosTabla.length);
        console.log(data);
      }
    });
  }

}
