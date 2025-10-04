import { Component, EventEmitter, OnInit, Output, Input, Renderer2 } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comparativecalibrationsmodal',
  templateUrl: './comparativecalibrationsmodal.component.html',
  styleUrls: ['./comparativecalibrationsmodal.component.css']
})
export class ComparativecalibrationsmodalComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() CalibrationData: any = [];
  @Input() CalendarData: any = [];
  @Input() CalibrationID: string = "";
  TableData: IAutoEvaluationResult
  
  response1: IAutoEvaluationResult;
  response2: IAutoEvaluationResult;

  EvaluationResult1: number = 0;
  EvaluationResult2: number = 0;

  constructor(
    private renderer: Renderer2,
    private configurationService: ConfigurationService,
    private utilsService: UtilsService,
    private evaluatorsService: EvaluatorsService,
    private calibrationService: CalibrationService,
    private peopletobeevaluatedService: PeopletobeevaluatedService) {}

  async ngOnInit(): Promise<any> {
    this.utilsService.showLoading();
    //console.log(this.CalibrationData)
 
    if(this.CalendarData.tipo === '90'){
      try {
        this.response1 = await ((this.calibrationService.GetHistoricEvaluatedFirstEvaluation90(this.CalibrationData.evaluado.codigoFicha, this.CalibrationData.evaluado.codigoPuesto, this.CalendarData.vCodigo).toPromise()));
        this.EvaluationResult1 = this.response1.registros.resultado
      } catch (error) {
        return Swal.fire('ERROR','Hubo un error al obtener la evaluación original.','error')
      }
      try {
        this.response2 = await ((this.calibrationService.GetEvaluatedCalibration90(this.CalibrationData.idEvaluacion)).toPromise());
        this.EvaluationResult2 = this.response2.registros.resultado
      } catch (error) {
        return Swal.fire('ERROR','Hubo un error al obtener la calibración.','error')
      }
    }

    if(this.CalendarData.tipo === '180'){
      try {
        this.response1 = await ((this.calibrationService.GetHistoricEvaluatedFirstEvaluation180(this.CalibrationData.evaluado.codigoFicha, this.CalibrationData.evaluado.codigoPuesto, this.CalendarData.vCodigo).toPromise()));
        this.EvaluationResult1 = this.response1.registros.resultado
      } catch (error) {
        return Swal.fire('ERROR','Hubo un error al obtener la evaluación original.','error')
      }
      try {
        this.response2 = await ((this.calibrationService.GetEvaluatedCalibration180(this.CalibrationData.idEvaluacion)).toPromise());
        this.EvaluationResult2 = this.response2.registros.resultado
      } catch (error) {
        return Swal.fire('ERROR','Hubo un error al obtener la calibración.','error')
      }
    }

    //console.log(this.response1);
    //console.log(this.response2);

    this.utilsService.closeLoading();
  }

  CloseModal(): void{
    this.configurationService.getStaticMenuDeactivated().subscribe(data => {
      data ? this.renderer.setStyle(document.body, 'overflow-y', 'auto') : ''
      this.close.emit(false);
      this.CalibrationData = [];
      this.CalendarData = [];
      this.CalibrationID = "";
    })
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

  obtenerNombreCompetenciasFiltrada1(value: string): string {
  if(this.response1.registros.competenciaFortaleza === "" || this.response1.registros.competenciaOportunidad === ""){
      return "-No se encontró el título de la competencia seleccionada-"
    }
    else{
      let returnedValue = this.response1.registros.competenciasResultado.filter(item => item.codigo === value);
      return returnedValue[0].titulo + ":"
  }
 }

  obtenerNombreCompetenciasFiltrada2(value: string): string {
    if(this.response1.registros.competenciaFortaleza === "" || this.response1.registros.competenciaOportunidad === ""){
        return "-No se encontró el título de la competencia seleccionada-"
      }
      else{
        let returnedValue = this.response1.registros.competenciasResultado.filter(item => item.codigo === value);
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
