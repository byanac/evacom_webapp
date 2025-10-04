import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { range } from 'rxjs';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-changefeedbackperiod',
  templateUrl: './changefeedbackperiod.component.html',
  styleUrls: ['./changefeedbackperiod.component.css'],
})
export class ChangefeedbackperiodComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() CalendarCode = new EventEmitter<string>();
  es = {
    firstDayOfWeek: 1,
    dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
    dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: 'Hoy',
    clear: 'Borrar',
    dateFormat: 'dd/mm/yy', // Formato de la fecha
  };
  rangeDates: Date[];
  RetroFechaIni:string = ""
  RetroFechaFin:string = ""
  NuevaFechaInicio:string = "....."
  NuevaFechaFin:string = "....."

  constructor( private renderer: Renderer2, private utilService: UtilsService, private calendarService: CalendarService, private feedbackService : FeedbackService ) { }

  async ngOnInit(): Promise<any> {
    this.utilService.showLoading();
   
    const CalendarData = await this.calendarService.getDataScheduleApi().toPromise();
    let FilteredCalendar = CalendarData.registros.find(data => data.vCodigo === this.CalendarCode)
    ////console.log(FilteredCalendar)
    this.RetroFechaIni = this.utilService.formatDateToDDMMYYYY(FilteredCalendar.dRetroIni)
    this.RetroFechaFin = this.utilService.formatDateToDDMMYYYY(FilteredCalendar.dRetroFin)
    ////console.log(CalendarData)
    ////console.log(this.CalendarCode)
    this.utilService.closeLoading();
  }

  onDateChange(event: any) {
    // Your custom logic here
    ////console.log('Selected dates:', this.rangeDates);
    this.NuevaFechaInicio = this.formatFecha(this.rangeDates[0])
    ////console.log(this.formatFecha(this.rangeDates[0]))
    if(this.formatFecha(this.rangeDates[1]) === '01/01/1970'){
      this.NuevaFechaFin = "....."
    }else{
      this.NuevaFechaFin = this.formatFecha(this.rangeDates[1])
    }

  }

  SendRangeDates():void | Promise<SweetAlertResult>{
    const FormatedDatesYYYYMMDD = this.rangeDates.map(dateString => {
      const date = new Date(dateString);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2); 
      const year = date.getFullYear();
  
      return `${year}-${month}-${day}`;
    })
    
    let TodayDate = new Date();
    ////console.log(TodayDate)

    if (this.rangeDates[0] > this.rangeDates[1]) {
      return Swal.fire('Aviso', 'La fecha de fin no puede ser menor a la fecha de inicio.', 'warning');
    } else if (this.rangeDates[0] < TodayDate) { // Cambiado
      return Swal.fire('Aviso', 'La fecha de inicio no puede ser menor a la fecha de hoy.', 'warning');
    } else if (this.rangeDates[1] < this.rangeDates[0]) {
      return Swal.fire('Aviso', 'La fecha de fin no puede ser menor a la fecha de inicio.', 'warning'); // Corrigido el mensaje
    } 
    
    
  
        Swal.fire({
          title:  "Aviso",
          text: `¿Quieres realizar el cambio/extensión del periodo de retroalimentación del ${this.formatFecha(FormatedDatesYYYYMMDD[0])} al ${this.formatFecha(FormatedDatesYYYYMMDD[1])}?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Cambiar',
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.value) {
            this.utilService.showLoading();
            let PostBody: any = {
              vCodigo: this.CalendarCode,
              dPeriodoIni: FormatedDatesYYYYMMDD[0],
              dPeriodoFin: FormatedDatesYYYYMMDD[1],
            }
    
            this.feedbackService.PostUpdateFeedbackDates(PostBody).subscribe({
              next: (data) => {
                ////console.log(data)
                Swal.fire({
                  title:  "La modificación fue realizada",
                  text: "La modificación de las fechas de la fase de retroalimentación fueron modificadas con éxito.",
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'OK',
                  onClose: () => {
                    this.CloseModal()
                  }
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

  formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    
    // Asegurarse de obtener los valores en UTC para evitar cambios por la zona horaria local
    const dia = ("0" + fecha.getUTCDate()).slice(-2);
    const mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2); // El mes es 0-indexado, por eso sumamos 1
    const anio = fecha.getUTCFullYear();

    return `${dia}/${mes}/${anio}`;
}

  CloseModal(): void{
    this.close.emit(false);
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

}
