import { UtilsService } from 'src/app/services/utils/utils.service';
import { Component, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ActivatedRoute,Router } from '@angular/router';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-evaluaciones-finalizadas',
  templateUrl: './ver-evaluaciones-finalizadas.component.html',
  styleUrls: ['./ver-evaluaciones-finalizadas.component.css']
})
export class VerEvaluacionesFinalizadasComponent implements OnInit {
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  CalendarType: string = this.route.snapshot.paramMap.get('CalendarType');
  EvaluatorFileCode: string = this.route.snapshot.paramMap.get('EvaluatorFileCode');
  EvaluatorPositionCode: string = this.route.snapshot.paramMap.get('EvaluatorPositionCode');
  DataFromsessionStorage:ILoginData = this.loginService.GetUserSession();
  TableData: IAutoEvaluationResult[] = []
  TypeAndPeriodName: string = "";

  constructor(
    private calendarService: CalendarService, 
    private evaluatorsService: EvaluatorsService,
    private loginService: LoginService,
    private route: ActivatedRoute, 
    private utilsService: UtilsService,    
    private router: Router)
  {}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
  
    try {
      const EvaluatorFinishedEvaluations = await this.evaluatorsService.GetFinishedEvaluatorsEvaluations(this.EvaluatorPositionCode,this.CalendarCode).toPromise();
      const scheduleData = await this.calendarService.getDataScheduleApi().toPromise();
      const filteredSchedule = scheduleData.registros.filter((item: { tipo: string }) => item.tipo === this.CalendarType);
  
      this.TableData = EvaluatorFinishedEvaluations.registros;
      //console.log(this.TableData)

        if (filteredSchedule.length > 0) {
          this.TypeAndPeriodName = filteredSchedule[0].vNombre;
          //console.log(this.TypeAndPeriodName)
        } else {
          throw new Error('No se encontró un calendario con el tipo especificado.');
        }
        
      this.utilsService.closeLoading();
    } catch (error) {  
      Swal.fire('Error al obtener los datos de una evaluación','Por favor, inténtalo de nuevo más tarde.','error').then(
        () => {this.router.navigateByUrl('/home');});
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

  obtenerNombreCompetenciasFiltrada(value: string, data: any[]): string {
    let returnedValue = data.filter(item => item.codigo === value);
    return returnedValue[0].titulo + ":"
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