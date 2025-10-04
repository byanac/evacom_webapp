import { Component, OnInit } from '@angular/core';
import { ICalibrationGetEvaluatedReport } from 'src/app/interfaces/ICalibrationGetEvaluatedReport';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-calibracion',
  templateUrl: './reporte-calibracion.component.html',
  styleUrls: ['./reporte-calibracion.component.css']
})
export class ReporteCalibracionComponent implements OnInit {
  ShowChangeCalibrationPeriodModal:boolean = false;
  DataList:ICalibrationGetEvaluatedReport;
  calendarData: ISchedule;
  Periodo:string = "";
  Activatetable:boolean = false;
  UserData: ILoginData = this.loginService.GetUserSession();
  AntiguaFechaDeExpiracion: any;
  NombreEvaluado: string = ""
  IdCalibracion: number
  expandedRows: Set<string> = new Set();

  constructor(
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private calibrationService: CalibrationService,
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
      const data = await this.calibrationService.GetCalibrationReport(this.Periodo).toPromise(); 
      if(data.registros.length === 0){
        Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
      }else{
        this.Activatetable = true;     
        this.DataList = data
        ////console.log(this.DataList)
        this.utilsService.closeLoading();;
      }
    }
  }

  toggleRowExpansion(codigoFicha: string) {
    if (this.expandedRows.has(codigoFicha)) {
      this.expandedRows.delete(codigoFicha); 
    } else {
      this.expandedRows.add(codigoFicha); 
    }
  }

  isRowExpanded(codigoFicha: string): boolean {
    return this.expandedRows.has(codigoFicha);
  }

  ReturnFormatedDate(Date:string){
    return this.utilsService.DecodeDate(Date)
  }

  ReturnFormatedStatusDate(DateInNumbers: string): { formattedDate: string, isPast: boolean, isToday: boolean, isUpcoming: boolean } {
    const timestamp = Number(DateInNumbers);
    const formattedDate = new Date(timestamp);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isPast = formattedDate < today;
    const isToday = formattedDate.getTime() === today.getTime();

    const fiveDaysFromToday = new Date(today);
    fiveDaysFromToday.setDate(today.getDate() + 5);
    fiveDaysFromToday.setHours(0, 0, 0, 0);
  
    const isUpcoming = formattedDate > today && formattedDate <= fiveDaysFromToday;
  
    return {
      formattedDate: formattedDate.toLocaleDateString(),
      isPast,
      isToday,
      isUpcoming
    };
}

getStatusClass(fechaLimite: string, CalibrationStatus: boolean): string {
  const statusDate = this.ReturnFormatedStatusDate(fechaLimite);

  if(CalibrationStatus){
    return 'bg-white';
  }

  if (statusDate.isPast || statusDate.isToday) {
    return 'bg-red-500';
  } else if (statusDate.isUpcoming) {
    return 'bg-yellow-500';
  } else {
    return 'bg-white';
  }
}
  
  SendNotification(NombreEvaluador:string,idCalibracion: number){
      if(this.Periodo != ''){
        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas enviar un recordatorio por correo a ${NombreEvaluador}?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Enviar',
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.value) {
            this.utilsService.showLoading();
            this.calibrationService.GetSendEvaluatorNotification(idCalibracion)
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
        })
      }    
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  ShowModal(FechaExpiracion: number, nombreEvaluado: string,idcalibracion: number){
    this.ShowChangeCalibrationPeriodModal = true;
    this.AntiguaFechaDeExpiracion = FechaExpiracion
    this.NombreEvaluado = nombreEvaluado
    this.IdCalibracion = idcalibracion
  }

  closeModal(event: boolean) {
    this.ShowChangeCalibrationPeriodModal = event;
  }

}
