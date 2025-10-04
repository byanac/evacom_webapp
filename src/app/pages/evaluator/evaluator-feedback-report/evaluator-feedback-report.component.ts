import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IFilterBody } from 'src/app/interfaces/IFilterBody';
import { IKnowledgeReportResponse } from 'src/app/interfaces/IKnowledgeReportResponse';
import { ITeam } from 'src/app/interfaces/ITeam';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { KnowledgeService } from 'src/app/services/knowledge/knowledge.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { TeamService } from 'src/app/services/team/team.service';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/auth/login.service';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { IFeedbackEvaluatorReport } from 'src/app/interfaces/IFeedbackEvaluatorReport';

@Component({
  selector: 'app-evaluator-feedback-report',
  templateUrl: './evaluator-feedback-report.component.html',
  styleUrls: ['./evaluator-feedback-report.component.css']
})
export class EvaluatorFeedbackReportComponent implements OnInit {
  DataList:IFeedbackEvaluatorReport ;
  calendarData: ISchedule;
  Periodo:string = "";
  Activatetable:boolean = false;
  UserData: ILoginData = this.loginService.GetUserSession();

  constructor(
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private feedbackService: FeedbackService,
    private loginService: LoginService){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
    const data = await this.calendarService.getDataScheduleApi().toPromise()
    this.calendarData = data;
    this.utilsService.closeLoading();
  }

  async FilterData(){
    if(this.Periodo === ""){
      Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
    }else{
      this.utilsService.showLoading();
      ////console.log(this.Periodo)
      const data = await this.feedbackService.GetFeedbackReportfromSelectedEvaluator(this.UserData.codPuesto,this.Periodo).toPromise(); 
      if(data.registros.length === 0){
        Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
      }else{
        this.Activatetable = true;     
        this.DataList = data.registros
        this.utilsService.closeLoading();;
      }
    }
  }

  sendEvaluatedNotification(nombres: string, idRetroalimentacion: string){
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
        this.feedbackService.SendEvaluatedForDoFeedback(idRetroalimentacion)
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

FormatDate(date: string): any{
  return this.utilsService.GetFormatedDate(date)
}

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }
}
