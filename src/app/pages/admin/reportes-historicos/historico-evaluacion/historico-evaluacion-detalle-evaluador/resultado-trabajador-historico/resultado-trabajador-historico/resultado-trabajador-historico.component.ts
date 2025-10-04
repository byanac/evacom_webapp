import { Component, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router'
import { CalendarService } from 'src/app/services/calendar/calendar.service';

@Component({
  selector: 'app-resultado-trabajador-historico',
  templateUrl: './resultado-trabajador-historico.component.html',
  styleUrls: ['./resultado-trabajador-historico.component.css']
})
export class ResultadoTrabajadorHistoricoComponent implements OnInit {
  TcodFichaFetch: string = this.route.snapshot.paramMap.get('TcodFichaFetch');
  TcodPuestoToFetch: string = this.route.snapshot.paramMap.get('TcodPuestoToFetch');
  EcodFichaFetch: string = this.route.snapshot.paramMap.get('EcodFichaFetch');
  EcodPuestoFetch: string = this.route.snapshot.paramMap.get('EcodPuestoFetch');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  CalendarType: string = this.route.snapshot.paramMap.get('CalendarType');
  TableData:IAutoEvaluationResult
  FactsDataFromApi: any;
  DataFromsessionStorage:ILoginData;
  EvaluationResult: number;
  TypeAndPeriodName: string = '';

  constructor(
    private peopletobeevaluatedService: PeopletobeevaluatedService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private calendarService: CalendarService
  ){}

  async ngOnInit(): Promise<any>  {
    this.utilsService.showLoading();
    try {
            const response = await this.peopletobeevaluatedService
              .GetWorkerData(this.TcodFichaFetch, this.TcodPuestoToFetch, this.EcodFichaFetch, this.EcodPuestoFetch, this.CalendarCode)
             .toPromise();
              this.EvaluationResult = response.registros.resultado
               response.registros.oportunidad = response.registros.oportunidad.trim();
               response.registros.fortaleza = response.registros.fortaleza.trim();
              this.TableData = response;
              //console.log(this.TableData)
              const CalendarData: any = await ((this.calendarService.getCalendarVigencies())).toPromise();
              const CalendarString = CalendarData.registros.filter((data: { vCodigo: string; }) => data.vCodigo === this.CalendarCode)
              this.TypeAndPeriodName = CalendarString[0].vNombre;
              this.utilsService.closeLoading();
           } catch (error) {
             return Swal.fire('Error al obtener los datos de la evaluación ', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
               this.router.navigateByUrl('/home');
             });
           }  

    }

    PrintButton(){
      window.print();
    }
  
    calcularPromedioPonderado(resultado): string {
      let result = (resultado / 5) * 100;
      let message: string;
      message = result.toFixed(2) + "%";
      return message;
    }
  
  ObtenerLabeldeEstado(resultado: number): string {
    let result = (resultado / 5) * 100;
    let message: string;
  
    switch (true) {
        case (result >= 50 && result <= 75):
            message = "EN DESARROLLO";
            break;
        case (result >= 0 && result <= 49):
            message = "NO CUMPLE";
            break;
        case (result >= 75 && result <= 94):
            message = "EFECTIVO";
            break;
        default:
            message = "ALTAMENTE EFECTIVO";
            break;
    }
    return message;
  }
  
  obtenerNombreCompetenciasFiltrada(value: string): string {
    //////console.log(value)
    if(this.TableData.registros.competenciaFortaleza === "" || this.TableData.registros.competenciaOportunidad === ""){
      return "-No se encontró el título de la competencia seleccionada-"
    }
    else{
      let returnedValue = this.TableData.registros.competenciasResultado.filter(item => item.codigo === value);
      return returnedValue[0].titulo + ":"
    }
  }
  
  
  calcularPromedioFinal(resultado: number): string {
    let result = (resultado / 5) * 100
    return(result.toFixed(2))
  }
  
  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }
}
