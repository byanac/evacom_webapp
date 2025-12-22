import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPIDEvaluatorReport } from 'src/app/interfaces/IPIDEvaluatorReport';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ExceptionReportsService } from 'src/app/services/exception-reports/exception-reports.service';
import { ExceptionService } from 'src/app/services/exception/exception.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-excepcion-pid-cumplimiento-detalle',
  templateUrl: './excepcion-pid-cumplimiento-detalle.component.html',
  styleUrls: ['./excepcion-pid-cumplimiento-detalle.component.css']
})
export class ExcepcionPidCumplimientoDetalleComponent implements OnInit {

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
  DataType: string = '';
  expandedRows: Set<string> = new Set();
  ShowChangeExceptionLimitDateModal: boolean = false;
  EntryData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private loginService: LoginService,
    private PIDservice: PidService,
    private exceptionReportsService: ExceptionReportsService,
    private router: Router
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

      let dataToShow: any;


      if(this.Tipo === 'PID'){
        dataToShow = await this.exceptionReportsService.GetExceptionReportTypePIDEvaluatedByEvaluator(this.EvaluatorPosition,this.CalendarCode).toPromise();
      }else{
        dataToShow = await this.exceptionReportsService.GetExceptionReportTypePIDCOMPLIANCEEvaluatedByEvaluator(this.EvaluatorPosition,this.CalendarCode).toPromise();
      }

      if(dataToShow.registros.length === 0){
        Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
      }else{
        this.Activatetable = true;   
        this.DataType = this.Tipo;
        this.DataList = dataToShow
        //console.log(this.DataList)
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

    toggleRowExpansion(codigoFicha: string) {
      if (this.expandedRows.has(codigoFicha)) {
        this.expandedRows.delete(codigoFicha); // Collapse if already expanded
      } else {
        this.expandedRows.add(codigoFicha); // Expand the clicked row
      }
    }
    
    isRowExpanded(codigoFicha: string): boolean {
      if(codigoFicha){
        return this.expandedRows.has(codigoFicha);
      }
    }
  
    ReturnFormatedDate(Date:string){
      return this.utilsService.DecodeDate(Date)
    }
  
    ReturnFormatedStatusDate(DateInNumbers: string): { 
      formattedDate: string, 
      isPast: boolean, 
      isToday: boolean, 
      isUpcoming: boolean 
    } {
      // Convertir la cadena de fecha al formato adecuado para JavaScript
      const timestamp = new Date(DateInNumbers.replace(" ", "T")); // Reemplazar el espacio por 'T' para formato ISO
      
      if (isNaN(timestamp.getTime())) {
        throw new Error("Fecha inválida. Por favor, asegúrate de usar el formato 'YYYY-MM-DD HH:mm:ss'.");
      }
    
      // Crear la fecha de hoy y establecer la hora a medianoche
      const today = new Date();
      today.setHours(0, 0, 0, 0);
    
      // Verificar si la fecha es pasada, hoy o en los próximos 5 días
      const isPast = timestamp < today;
      const isToday = timestamp.getTime() === today.getTime();
      
      // Obtener la fecha 5 días a partir de hoy y establecer su hora a medianoche
      const fiveDaysFromToday = new Date(today);
      fiveDaysFromToday.setDate(today.getDate() + 5);
    
      const isUpcoming = timestamp > today && timestamp <= fiveDaysFromToday;
    
      return {
        formattedDate: timestamp.toLocaleDateString(),
        isPast,
        isToday,
        isUpcoming
      };
    }
  
    getStatusClass(fechaLimite: string, EstadoEvaluado: boolean, EstadoEvaluador: boolean, VeredictoEvaluador: boolean): string {
      const statusDate = this.ReturnFormatedStatusDate(fechaLimite);

      if(EstadoEvaluado && EstadoEvaluador && VeredictoEvaluador){
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
  
    onImgError(event){
      event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
    }

    ShowModal(item: any){
      this.EntryData = item;
      this.ShowChangeExceptionLimitDateModal = true;
    }

    removeLeadingZeros(value: string | number): string {
      const input = value.toString();
      return input.replace(/^0+/, '');
    }
  
    closeModal(event: boolean) {
      this.ShowChangeExceptionLimitDateModal = event;
      this.FilterData();
    }
      regresar() {
      sessionStorage.setItem('retornaExcepcion', 'true');
    return this.router.navigateByUrl('/home/reporte-excepcion');
    }  
}
