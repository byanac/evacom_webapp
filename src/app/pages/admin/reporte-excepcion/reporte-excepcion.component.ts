import { Component, OnInit } from '@angular/core';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { AutoevaluationService } from 'src/app/services/autoevaluation/autoevaluation.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { ExceptionService } from 'src/app/services/exception/exception.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { KnowledgeService } from 'src/app/services/knowledge/knowledge.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-excepcion',
  templateUrl: './reporte-excepcion.component.html',
  styleUrls: ['./reporte-excepcion.component.css']
})
export class ReporteExcepcionComponent implements OnInit {
  UserData: ILoginData = this.loginService.GetUserSession();
  ShowChangeCalibrationPeriodModal:boolean = false;
  ViewTypeSelected: string = "";
  OnSearchViewType: string = "";
  Periodo:string = "";
  NombreEvaluado: string = ""
  calendarData: ISchedule;
  showtable: boolean = false;
  IdCalibracion: number
  expandedRows: Set<string> = new Set();
  AntiguaFechaDeExpiracion: any;
  DataList:any;
  ShowChangeExceptionLimitDateModal: boolean = false;
  EntryData: any[] = [];


  constructor(
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private EmailService: SendemailService,
    private loginService: LoginService,
    private exceptionService: ExceptionService,
    private calibrationService: CalibrationService){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
    const data = await this.calendarService.getDataScheduleApi().toPromise()
    this.calendarData = data;
    this.utilsService.closeLoading();
      const fuePorRegresar = sessionStorage.getItem('retornaExcepcion'); 
     let withSessions=false;
     if (fuePorRegresar === 'true') {
       const periodoExcepcion = sessionStorage.getItem('periodoExcepcion');
        if ((periodoExcepcion)  && (periodoExcepcion.length>0)){
        this.Periodo=periodoExcepcion;          
        withSessions=true;
      }
      const tipoExcepcion = sessionStorage.getItem('tipoExcepcion');
        if ((tipoExcepcion)  && (tipoExcepcion.length>0)){
        this.ViewTypeSelected=tipoExcepcion;          
        withSessions=true;
      }
      sessionStorage.removeItem('retornaExcepcion');
      if (withSessions){
        this.FilterData();
      }
     }
  }

  async FilterData(){
    if(this.Periodo === ""){
      Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
    }else  if(this.ViewTypeSelected === ""){
      Swal.fire('El campo tipo de excepción está vacío', 'Debe seleccionar el campo de tipo de excepción para continuar.','error');
    }else{
      this.utilsService.showLoading();
      this.showtable = false;

      const BodyToSend: {} = {
        ficha: "",
        puesto: "",
        calendario: this.Periodo,
        gerencias: [],
        equipo: [],
        fase : this.ViewTypeSelected
      }

      const data = await this.exceptionService.GetAdminExceptionReports(BodyToSend).toPromise();

      if(data.registros.length === 0){
        Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
      }else{    
        this.DataList = data
        this.OnSearchViewType = this.ViewTypeSelected;
        this.showtable = true;
         sessionStorage.setItem('periodoExcepcion', this.Periodo);
         sessionStorage.setItem('tipoExcepcion', this.ViewTypeSelected);
        this.utilsService.closeLoading();;
      }
    }
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
  
  sendEmailKnowledge(nombre: string, codpuesto: string, codficha: string){
    if(this.Periodo != ''){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas enviar un recordatorio por correo a ${nombre}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading();
          this.EmailService.sendKnowledgeEmail(this.Periodo, codpuesto, codficha)
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

  sendEmailAutoevaluation(nombre: string, codpuesto: string, codficha: string){
    if(this.Periodo != ''){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas enviar un recordatorio por correo a ${nombre}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading();
          this.EmailService.sendAutoEvaluationEmail(this.Periodo, codpuesto, codficha)
          .subscribe({
            next: (data) => {
              //////console.log(data);
              return Swal.fire("Recordatorio enviado de manera exitosa.", "","success"
              );
            },
            error: (error) => {
              console.error("Error:", error.message);
              return Swal.fire("Error al enviar el recordatorio.",'',"error");
            }
          });    
        }
      })
    }    
  }

  SendNotificationCalibration(NombreEvaluador:string,idCalibracion: number){
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


  ShowModal(item: any){
    this.EntryData = item;
    this.ShowChangeExceptionLimitDateModal = true;
  }

  closeModal(event: boolean) {
    this.ShowChangeExceptionLimitDateModal = event;
  }

     regresar() {
      sessionStorage.setItem('retornaExcepcion', 'true');
      history.back();
    }
}

