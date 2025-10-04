import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import Swal from 'sweetalert2';
import { PidService } from 'src/app/services/pid/pid.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { IPIDEvaluatorReport } from 'src/app/interfaces/IPIDEvaluatorReport';

@Component({
  selector: 'app-pid-evaluatortable',
  templateUrl: './pid-evaluatortable.component.html',
  styleUrls: ['./pid-evaluatortable.component.css']
})
export class PidEvaluatortableComponent implements OnInit {
  SesionData = this.loginService.GetUserSession();
  DataList: IPIDEvaluatorReport[];
  calendarData: ISchedule;
  Periodo:string = "";
  Tipo: string = "";
  Activatetable:boolean = false;
  TituloPantalla: string = ""

  constructor(
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private PIDservice: PidService,
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
      ////console.log(this.Tipo)
      this.utilsService.showLoading();
      const data = await this.PIDservice.GetPIDandCompliancePIDReportfromEvaluator(this.SesionData.codPuesto,this.Periodo).toPromise();   
      if(data.registros.length === 0){
        Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
      }else{
        this.Activatetable = true;     
        this.DataList = data.registros
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
        this.PIDservice.SendPIDEvaluatedNotification(codFichaEvaluado,this.Periodo).subscribe({
          next: (data) => {
            ////console.log(data)
            Swal.fire({
              title:  `Notificación enviada`,
              text: `Notificación enviada con éxito.`,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              window.location.reload();
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

  FormatDate(date: string): any{
    return this.utilsService.GetFormatedDate(date)
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }
}
