import { Component, Input, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';

@Component({
  selector: 'app-workerresult',
  templateUrl: './workerresult.component.html',
  styleUrls: ['./workerresult.component.css'],
})
export class WorkerresultComponent implements OnInit {
  @Input() TableData: IAutoEvaluationResult
  @Input() CalendarCode: string = "";
  @Input() EcodFicha: string = "";
  AutoEvaluationResult: number;
  TypeAndPeriodName: string = "";
  DataFromsessionStorage:ILoginData = this.loginService.GetUserSession();

  constructor(private calendarService: CalendarService, private evaluatorsService: EvaluatorsService,private loginService: LoginService){}

  async ngOnInit(): Promise<void>{
    this.AutoEvaluationResult = this.TableData.registros.resultado;
    this.calendarService.getDataScheduleApi().subscribe(data => {
      let typeandperiodname: ISchedule = data.registros.filter((item: { tipo: string; }) => item.tipo === this.TableData.registros.tipo);
      this.TypeAndPeriodName = typeandperiodname[0].vNombre
    })
  }

  PrintButton(){
    window.print();
  }

  calcularPromedioPonderado_antes(resultado): string {
    let result = (resultado / 5) * 100;
    let message: string;
    message = result.toFixed(2) + "%";
    return message;
  }
calcularPromedioPonderado(resultado) {
    let respuesta = ((resultado -1) *25);
    let message: string;
    message = respuesta.toFixed(2) + "%";
    return message;
  }
ObtenerLabeldeEstado(resultado: number): string {
  //let result = (resultado / 5) * 100;
   let result = ((resultado -1) *25);
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
 // let result = (resultado / 5) * 100
   let result = ((resultado -1) *25);
  return(result.toFixed(2))
}

removeLeadingZeros(value: string | number): string {
  const input = value.toString();
  return input.replace(/^0+/, '');
}
}