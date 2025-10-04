import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { IPIDEvaluatorReport } from 'src/app/interfaces/IPIDEvaluatorReport';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalleevaluador',
  templateUrl: './detalleevaluador.component.html',
  styleUrls: ['./detalleevaluador.component.css']
})
export class DetalleevaluadorComponent implements OnInit {
  ModalityText: string = this.route.snapshot.paramMap.get('ModalityText');
  EvaluatorFile: string = this.route.snapshot.paramMap.get('EvaluatorFile');
  EvaluatorPosition: string = this.route.snapshot.paramMap.get('EvaluatorPosition');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  EvaluatorName: string = this.route.snapshot.paramMap.get('EvaluatorName')
  DataList:any;
  calendarData: ISchedule;
  Tipo: string = "";
  Activatetable:boolean = false;
  SesionData = this.loginService.GetUserSession();
  CalendarType:string
  TableData: IPIDEvaluatorReport;
  ShowPIDButtons: boolean = false;
  ShowCompliancePIDButtons: boolean = false;
  PeriodName: any

  constructor(
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private loginService: LoginService,
    private PIDservice: PidService
  ){ }

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();

    this.calendarService.GetCalendarName(this.CalendarCode).then(result => {
      this.PeriodName = result;
    });
    
    const data = await this.calendarService.getDataScheduleApi().toPromise()
    this.calendarData = data;
    this.utilsService.closeLoading();
  }

  async FilterData(){
    if(this.Tipo === ""){
      Swal.fire('El campo tipo está vacío', 'Debe seleccionar el campo de tipo para continuar.','error');
    }
    else{
      ////console.log(this.Tipo)
      this.utilsService.showLoading();
      const data = await this.PIDservice.GetPIDandCompliancePIDReportfromEvaluator(this.EvaluatorPosition,this.CalendarCode).toPromise();   
      if(data.registros.length === 0){
        Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
      }else{
        this.Activatetable = true;     
        this.DataList = data
        this.utilsService.closeLoading();;
      }
    }
  }

  NotifyEvaluated(nombreEvaluado: string, codFichaEvaluado: string): void{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas notificar al evaluado ${nombreEvaluado}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Notificar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilsService.showLoading()
        this.PIDservice.SendPIDEvaluatedNotification(codFichaEvaluado,this.CalendarCode).subscribe({
          next: (data) => {
            ////console.log(data)
            Swal.fire({
              title:  `Notificación enviada`,
              text: `Notificación enviada con éxito.`,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            })
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error :(",
              text: error.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
            ////console.log("Error:", error.message)
          }
        });
      }
    })
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  NotifyEvaluator(nombreEvaluado: string,codFichaEvaluado: string): void{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas notificar al evaluador ${this.EvaluatorName} sobre su evaluado ${nombreEvaluado}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Notificar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilsService.showLoading()
        this.PIDservice.SendPIDEvaluatorNotification(codFichaEvaluado,this.CalendarCode).subscribe({
          next: (data) => {
            ////console.log(data)
            Swal.fire({
              title:  `Notificación enviada`,
              text: `Notificación enviada con éxito.`,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            })
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error :(",
              text: error.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
            ////console.log("Error:", error.message)
          }
        });
      }
    })
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }
}
