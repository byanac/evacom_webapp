import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import Swal from 'sweetalert2';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { EvalgroupsCRUDService } from 'src/app/services/evalgroupsCRUD/evalgroups-crud.service';

@Component({
  selector: 'app-viewselectedworkerresult',
  templateUrl: './viewselectedworkerresult.component.html',
  styleUrls: ['./viewselectedworkerresult.component.css']
})
export class ViewselectedworkerresultComponent implements OnInit {
  CodEvaluatorFile: string = this.route.snapshot.paramMap.get('CodEvaluatorFile');
  CodCalendar: string = this.route.snapshot.paramMap.get('CodCalendar');
  IdEvaluation: string = this.route.snapshot.paramMap.get('IdEvaluation')
  grupoEvaluacionNombre: string = '';
  TableData: any
  AutoEvaluationResult: number;
  DataFromsessionStorage:ILoginData;

  constructor(
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private evaluatorsService: EvaluatorsService,
    private calendarService: CalendarService,
    private calibrationService: CalibrationService,
    private router: Router,
     private AsignationEvalGroupsService: EvalgroupsCRUDService
  ){}

  async ngOnInit(): Promise<any> {
    try {
      this.utilsService.showLoading();
  
      let response: IAutoEvaluationResult;
  
      const CalendarData: any = await this.calendarService.getCalendarVigencies().toPromise();
      const CalendarString = CalendarData.registros.filter(
        (data: { vCodigo: string }) => data.vCodigo === this.CodCalendar
      );
  
      if (!CalendarString || CalendarString.length === 0) {
        return Swal.fire('Error al obtener los datos del calendario','Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
          this.router.navigateByUrl('/home/reporte-calibracion');
        });;
      }
  
      const CalendarType = CalendarString[0].tipo;
  
      try {
        if (CalendarType === '90') {
          response = await this.calibrationService.GetEvaluatedCalibration90(this.IdEvaluation).toPromise();
        } else if (CalendarType === '180') {
          response = await this.calibrationService.GetEvaluatedCalibration180(this.IdEvaluation).toPromise();
        } else {
          throw new Error('Tipo de calendario no válido.');
        }
      } catch (error) {
        //console.log('Error al obtener los datos de calibración:', error);
        return Swal.fire('Error al obtener los datos de la calibración','Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
          this.router.navigateByUrl('/home/reporte-calibracion');
        });;
      }
      
      this.AutoEvaluationResult = response.registros.resultado;
      this.TableData = response;
        const evalgroup = await this.AsignationEvalGroupsService.GetEvalGroupsReportCRUD().toPromise();
    const registroEncontrado = evalgroup.registros.find(reg => reg.codigo === this.TableData.registros.grupoEvaluacion);
    this.grupoEvaluacionNombre = registroEncontrado.descripcion || 'Descripción no encontrada';
      this.utilsService.closeLoading();
    } catch (error) {
      //console.log('Error durante la carga de datos:', error);
      return Swal.fire('Error al cargar los datos', 'Por favor, inténtalo de nuevo más tarde.', 'error');
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
 regresar() {
      sessionStorage.setItem('retornaCalibracion', 'true');
      history.back();
    }
}
