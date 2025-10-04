import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { IPIDEvaluatorReport } from 'src/app/interfaces/IPIDEvaluatorReport';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ExceptionReportsService } from 'src/app/services/exception-reports/exception-reports.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-excepcion-retroalimentacion-detalle',
  templateUrl: './excepcion-retroalimentacion-detalle.component.html',
  styleUrls: ['./excepcion-retroalimentacion-detalle.component.css']
})
export class ExcepcionRetroalimentacionDetalleComponent implements OnInit {
  EvaluatorFile: string = this.route.snapshot.paramMap.get('EvaluatorFile');
  EvaluatorPosition: string = this.route.snapshot.paramMap.get('EvaluatorPosition');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  EvaluatorName: string = this.route.snapshot.paramMap.get('EvaluatorName')
  EvaluatorData: ILoginData = JSON.parse(sessionStorage.getItem('userdata'))
  CalendarType:string
  TableData: IPIDEvaluatorReport;
  PeriodName: any
  expandedRows: Set<string> = new Set();
  ShowChangeExceptionLimitDateModal: boolean = false;
  EntryData: any[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private calendarService: CalendarService,
    private utilsService: UtilsService,
    private feedbackService: FeedbackService,
    private exceptionEvaluatorReports: ExceptionReportsService
  ){ }

  async ngOnInit():Promise<void> {
    this.utilsService.showLoading();    
    const CalendarData: any = await ((this.calendarService.getDataScheduleApi())).toPromise();
    const CalendarString = CalendarData.registros.filter((data: { vCodigo: string; }) => data.vCodigo === this.CalendarCode)
    this.PeriodName = CalendarString[0].vNombre
    this.CalendarType = CalendarString[0].tipo
    await this.LoadData();
  }

  async LoadData(): Promise<any>{
    this.utilsService.showLoading();
    const response: any = await ((this.exceptionEvaluatorReports.GetExceptionReportTypeFeedbackEvaluatedByEvaluator(this.EvaluatorPosition,this.CalendarCode)).toPromise());
    
    if(response.registros.length > 0){
      this.TableData = response;
      //console.log(this.TableData)
    }else{
      Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
    }
    this.utilsService.closeLoading();
  }

  FormatDate(date: string): any{
    return this.utilsService.GetFormatedDate(date)
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

  getStatusClass(fechaLimite: string, CalibrationStatus: boolean, EvaluatorStatus: boolean, EvaluatedStatus: boolean): string {
    const statusDate = this.ReturnFormatedStatusDate(fechaLimite);

    if(CalibrationStatus){
      return 'bg-white';
    }

    if(EvaluatorStatus && EvaluatedStatus){
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
    this.LoadData();
  }

}
