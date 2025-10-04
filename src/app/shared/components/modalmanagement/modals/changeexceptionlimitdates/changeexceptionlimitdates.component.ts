import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { ExceptionService } from 'src/app/services/exception/exception.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-changeexceptionlimitdates',
  templateUrl: './changeexceptionlimitdates.component.html',
  styleUrls: ['./changeexceptionlimitdates.component.css']
})
export class ChangeexceptionlimitdatesComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() PeriodCode:any = new EventEmitter<any>();
  @Input() EntryData: any = new EventEmitter<any>();
  TodayDate = new Date()
  NuevaFechaFin:any;
  FechaInicioPeriodo: any;
  FechaFinPeriodo: any;
  AntiguaFechaFin: any;
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

  constructor(private renderer: Renderer2,private utilService: UtilsService, private calendarService: CalendarService, private exceptionService: ExceptionService) { }

  async ngOnInit(): Promise<any> {
    this.utilService.showLoading();
    this.AntiguaFechaFin = this.EntryData.fechaLimite;

    const data = await this.calendarService.getDataScheduleApi().toPromise()
    let dataresponse = data.registros.find(data => data.vCodigo === this.PeriodCode)
    this.FechaInicioPeriodo = new Date(dataresponse.dPeriodoIni)
    this.FechaFinPeriodo = new Date(dataresponse.dPeriodoFin)
    this.utilService.closeLoading()
  }
  
  SendRangeDates():void | Promise<SweetAlertResult>{
    let NuevaFechaExpiracion = new Date(this.NuevaFechaFin);
    let fechaExpiracionNormalizada = this.obtenerSoloFecha(new Date(NuevaFechaExpiracion));
    let fechaInicioNormalizada = this.obtenerSoloFecha(new Date(this.FechaInicioPeriodo));
    let fechaFinNormalizada = this.obtenerSoloFecha(new Date(this.FechaFinPeriodo));
    
    if(fechaExpiracionNormalizada >= fechaInicioNormalizada && fechaExpiracionNormalizada <= fechaFinNormalizada) {
      if (
        this.NuevaFechaFin.getUTCFullYear() < this.TodayDate.getUTCFullYear() || 
        (this.NuevaFechaFin.getUTCFullYear() === this.TodayDate.getUTCFullYear() && this.NuevaFechaFin.getUTCMonth() < this.TodayDate.getUTCMonth()) || 
        (this.NuevaFechaFin.getUTCFullYear() === this.TodayDate.getUTCFullYear() && this.NuevaFechaFin.getUTCMonth() === this.TodayDate.getUTCMonth() && 
        this.NuevaFechaFin.getUTCDate() < this.TodayDate.getUTCDate())
      ){
        return Swal.fire('Aviso', 'La nueva fecha de expiración no puede ser menor al día de hoy.', 'warning');
      }else{
        Swal.fire({
          title:  "Aviso",
          text: `¿Desea actualizar la fecha límite actual ${this.formatFecha(this.AntiguaFechaFin)} por la nueva fecha: ${this.formatFecha(this.NuevaFechaFin)}?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.value) {
            this.utilService.showLoading();
            
            let PostBody: any = {
              idExcepcion: this.EntryData.idExcepcion,
              fechaLimite: this.utilService.GetFormatedDateYYYYMMDD(this.NuevaFechaFin) + " 00:00:00",
            }

            //console.log(PostBody)
  
            this.exceptionService.PostUpdateExceptionLimitDate(PostBody).subscribe({
              next: (data) => {
                //console.log(data)
                Swal.fire({
                  title:  "La actualización ha sido realizada",
                  text: "La fecha límite ha sido actualizada con éxito.",
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
                //console.log("Error:", error.message)
              }
            });
          }
        })  
      }
    }else{
      return Swal.fire('Aviso', 'Le nueva fecha ingresada debe de estar dentro del periodo actual.', 'warning'); 
    }
  }

  formatFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = ("0" + fecha.getUTCDate()).slice(-2);
    const mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2);
    const anio = fecha.getUTCFullYear();
    if(fechaISO === undefined){
      return '.....'
    }else{
      return `${dia}/${mes}/${anio}`;
    }
  }

  obtenerSoloFecha(fecha) {
    return fecha.toISOString().split('T')[0]; // Devuelve "yyyy-mm-dd"
  }
  
  CloseModal(): void{
    this.close.emit(false);
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }
}