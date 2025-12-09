import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { IPIDEvaluatorReport } from 'src/app/interfaces/IPIDEvaluatorReport';

@Component({
  selector: 'app-reporte-retroalimentacionporevaluador-detalle',
  templateUrl: './reporte-retroalimentacionporevaluador-detalle.component.html',
  styleUrls: ['./reporte-retroalimentacionporevaluador-detalle.component.css']
})
export class ReporteRetroalimentacionporevaluadorDetalleComponent implements OnInit {
  EvaluatorFile: string = this.route.snapshot.paramMap.get('EvaluatorFile');
  EvaluatorPosition: string = this.route.snapshot.paramMap.get('EvaluatorPosition');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  EvaluatorName: string = this.route.snapshot.paramMap.get('EvaluatorName')
  EvaluatorData: ILoginData = JSON.parse(sessionStorage.getItem('userdata'))
  CalendarType:string
  TableData: IPIDEvaluatorReport[];
  PeriodName: any

  constructor(
    private route: ActivatedRoute,
    private evaluatorsService: EvaluatorsService, 
    private EmailService: SendemailService,
    private calendarService: CalendarService,
    private utilsService: UtilsService,
    private feedbackService: FeedbackService
  ){ }

  async ngOnInit():Promise<void> {
    this.utilsService.showLoading();
    const response: any = await ((this.feedbackService.GetFeedbackReportfromSelectedEvaluator(this.EvaluatorPosition,this.CalendarCode)).toPromise());
    this.TableData = [...response.registros].sort((a, b) => {
      if (a.estadoEvaluacion === false && b.estadoEvaluacion !== false) {
        return -1;
      }
    });

    ////console.log(this.TableData)
    
    const CalendarData: any = await ((this.calendarService.getDataScheduleApi())).toPromise();
    const CalendarString = CalendarData.registros.filter((data: { vCodigo: string; }) => data.vCodigo === this.CalendarCode)
    this.PeriodName = CalendarString[0].vNombre
    this.CalendarType = CalendarString[0].tipo
    ////console.log(this.CalendarType)
    this.utilsService.closeLoading();;
  }

  sendEvaluatedNotification(nombres: string, idEvaluacion: string){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas enviar un recordatorio por correo al evaluado ${nombres}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading();
          this.feedbackService.SendEvaluatedForDoFeedback(idEvaluacion)
          .subscribe({
            next: (data) => {
              ////console.log(data);
              Swal.fire("Recordatorio enviado de manera exitosa al evaluado.", "","success"
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

  sendEvaluatorNotification(nombres: string, idEvaluacion: string){
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas enviar un recordatorio por correo al evaluador ${this.EvaluatorName} con respecto a su evaluado ${nombres}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.feedbackService.SendEvaluatorForDoFeedback(idEvaluacion)
        .subscribe({
          next: (data) => {
            ////console.log(data);
            Swal.fire("Recordatorio enviado de manera exitosa al evaluador.", "","success"
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

 sendRetroEvaluatorNotificationEval(nombres: string,  fichaEvaluado: string){
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas enviar un recordatorio por correo al evaluador ${this.EvaluatorName} con respecto a su evaluado ${nombres}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.feedbackService.SendEvaluatorForDoFeedbackEval(this.EvaluatorFile, fichaEvaluado, this.CalendarCode)
        .subscribe({
          next: (data) => {
            ////console.log(data);
            Swal.fire("Recordatorio enviado de manera exitosa al evaluador.", "","success"
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
  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

}
