import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { ExceptionReportsService } from 'src/app/services/exception-reports/exception-reports.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-excepcion-evaluacion-detalle',
  templateUrl: './excepcion-evaluacion-detalle.component.html',
  styleUrls: ['./excepcion-evaluacion-detalle.component.css']
})
export class ExcepcionEvaluacionDetalleComponent implements OnInit {
  EvaluatorFile: string = this.route.snapshot.paramMap.get('EvaluatorFile');
  EvaluatorPosition: string = this.route.snapshot.paramMap.get('EvaluatorPosition');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  EvaluatorName: string = this.route.snapshot.paramMap.get('EvaluatorName')
  EvaluatorData: ILoginData = JSON.parse(sessionStorage.getItem('userdata'))
  ShowChangeExceptionLimitDateModal: boolean = false;
  CalendarType:string
  TableData: IEvaluatedWorkersFromEvaluator[];
  PeriodName: any
  expandedRows: Set<string> = new Set();
  EntryData: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private exceptionReportsService: ExceptionReportsService, 
    private EmailService: SendemailService,
    private calendarService: CalendarService,
    private utilsService: UtilsService,
  ){ }

  async ngOnInit():Promise<void> {
    this.utilsService.showLoading();
    const CalendarData: any = await ((this.calendarService.getCalendarVigencies())).toPromise();
    const CalendarString = CalendarData.registros.filter((data: { vCodigo: string; }) => data.vCodigo === this.CalendarCode)
    this.PeriodName = CalendarString[0].vNombre
    this.CalendarType = CalendarString[0].tipo
    await this.LoadData();
  }

  async LoadData(): Promise<any>{
    this.utilsService.showLoading();
    const response: any = await ((this.exceptionReportsService.GetExceptionReportTypeEvaluationEvaluatedByEvaluator(this.EvaluatorPosition,this.CalendarCode)).toPromise());
    this.TableData = [...response.registros].sort((a, b) => {
      if (a.estadoEvaluacion === false && b.estadoEvaluacion !== false) {
        return -1;
      }
    })

    //console.log(this.TableData)
    this.utilsService.closeLoading();
  }

  sendEmail(nombre: string){
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
          this.EmailService.sendEvaluatorEmail(this.CalendarCode, this.EvaluatorPosition, this.EvaluatorFile)
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

  toggleRowExpansion(codigoFicha: string) {
    if (this.expandedRows.has(codigoFicha)) {
      this.expandedRows.delete(codigoFicha); 
    } else {
      this.expandedRows.add(codigoFicha);
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

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  ShowModal(item: any){
    this.EntryData = item;
    this.ShowChangeExceptionLimitDateModal = true;
  }

  closeModal(event: boolean) {
    this.ShowChangeExceptionLimitDateModal = event;
    this.LoadData();
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }
  

}
