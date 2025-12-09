import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalles-evaluador',
  templateUrl: './detalles-evaluador.component.html',
  styleUrls: ['./detalles-evaluador.component.css']
})
export class DetallesEvaluadorComponent implements OnInit {
  EvaluatorFile: string = this.route.snapshot.paramMap.get('EvaluatorFile');
  EvaluatorPosition: string = this.route.snapshot.paramMap.get('EvaluatorPosition');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  EvaluatorName: string = this.route.snapshot.paramMap.get('EvaluatorName')
  EvaluatorData: ILoginData = JSON.parse(sessionStorage.getItem('userdata'))
  CalendarType:string
  TableData: IEvaluatedWorkersFromEvaluator[];
  PeriodName: any

  constructor(
    private route: ActivatedRoute,
    private evaluatorsService: EvaluatorsService, 
    private EmailService: SendemailService,
    private calendarService: CalendarService,
    private utilsService: UtilsService,
  ){ }

  async ngOnInit():Promise<void> {
    this.utilsService.showLoading();
    const response: any = await ((this.evaluatorsService.getWorkersfromEvaluatorReport(this.EvaluatorPosition,this.CalendarCode)).toPromise());
    this.TableData = [...response.registros].sort((a, b) => {
      if (a.estadoEvaluacion === false && b.estadoEvaluacion !== false) {
        return -1;
      }
    });
    
    const CalendarData: any = await ((this.calendarService.getDataScheduleApi())).toPromise();
    const CalendarString = CalendarData.registros.filter((data: { vCodigo: string; }) => data.vCodigo === this.CalendarCode)
    this.PeriodName = CalendarString[0].vNombre
    this.CalendarType = CalendarString[0].tipo
    ////console.log(this.CalendarType)
    this.utilsService.closeLoading();;
  }

  sendEmail(fichaEvaluado: string){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas enviar un recordatorio al evaluador ${this.EvaluatorName}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading();
          this.EmailService.sendEvaluatorEmailEvaluadorEvaluado(this.CalendarCode, this.EvaluatorPosition, this.EvaluatorFile, fichaEvaluado)
          .subscribe({
            next: (data) => {
              ////console.log(data);
              Swal.fire("Recordatorio enviado de manera exitosa.", "","success"
              );
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al enviar el recordatorio.",'',"error");
            }
          });
          }
      });     
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

}
