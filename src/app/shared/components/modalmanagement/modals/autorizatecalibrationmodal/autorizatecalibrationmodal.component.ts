import { LoginService } from 'src/app/services/auth/login.service';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import Swal from 'sweetalert2';;
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { ICalibrationFindEvaluatedByFicha } from 'src/app/interfaces/ICalibrationFindEvaluatedByFicha';
import { ICalibrationSendEvaluatedForAutorization } from 'src/app/interfaces/ICalibrationSendEvaluatedForAutorization';
import { ModalsService } from 'src/app/services/modals.service';
import { Subscription } from 'rxjs';
registerLocaleData(localeEs);

@Component({
  selector: 'app-autorizatecalibrationmodal',
  templateUrl: './autorizatecalibrationmodal.component.html',
  styleUrls: ['./autorizatecalibrationmodal.component.css']
})
export class AutorizatecalibrationmodalComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  TypeValue: string | any;
  DataFromsessionStorage:ILoginData = this.loginService.GetUserSession();;
  es: any;
  DataList:ICalibrationFindEvaluatedByFicha[] = [];
  FileValue: string = "";
  TypeAndPeriodName: string = "";
  PeriodCode: string = "";
  date: Date;
  ListToSend: any[] = [];

  FilteredFiles: string[] = []
  EndCalibrationPeriod: Date

  constructor(
    private utilsService: UtilsService,  
    private renderer: Renderer2,   
    private calendarService: CalendarService, 
    private loginService: LoginService,
    private calibrationService: CalibrationService,
    private modalStateService: ModalsService) { }

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading()
    this.subscription = this.modalStateService.getAutorizateCalibrationModalType().subscribe(value => {
      this.TypeValue = value;
    });

    const data = await this.calendarService.getDataScheduleApi().toPromise();

    if (!data || !data.registros || data.registros.length === 0) {
      this.utilsService.closeLoading()
      return;
    }

    let typeandperiodname: ISchedule = data.registros.filter((item: { tipo: string; }) => item.tipo === this.TypeValue);
    this.TypeAndPeriodName = typeandperiodname[0].vNombre
    this.PeriodCode = typeandperiodname[0].vCodigo
    this.EndCalibrationPeriod = new Date(typeandperiodname[0].dCalibFin)
    this.utilsService.closeLoading()
    this.es = {
      firstDayOfWeek: 1,
      dayNames: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      dayNamesShort: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
      dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
      monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
      monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      today: 'Hoy',
      clear: 'Borrar',
      dateFormat: 'dd/mm/yy',
    };
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async GetData(): Promise<any>{
    this.utilsService.showLoading();
    try {
      debugger
      let newValueWithZeros = this.padLeftWithZeros(this.FileValue);
      if (this.PeriodCode==""){
        this.utilsService.closeLoading
        return Swal.fire("INFO", "No se tiene un Calendario", "info");
      }
      const data = await this.calibrationService.GetEvaluatedByFolder(newValueWithZeros, this.PeriodCode).toPromise();
      //console.log(newValueWithZeros)
      if (data.mensaje==="OK"){
            if (data.registros.estadoEvaluacion && !this.FilteredFiles.includes(newValueWithZeros)) {
                    if(data){
                      if(data.registros.habilitaCalibracion){
                        this.FileValue = ""
                        this.DataList.push(data.registros);
                        this.FilteredFiles.push(data.registros.codigoFicha)
                        this.utilsService.closeLoading();
                      }else{
                        Swal.fire("INFO",`${data.registros.observacion}.`,'info')
                      }
                    }
                  }
      }
      if (data.mensaje==="Ficha no existe") {
          return Swal.fire("INFO", "Ficha no existe en relación de evaluados para el calendario seleccionado.", "warning");
      }
      if (data.mensaje==="No tiene evaluación completada para calibrar") {
          return Swal.fire("INFO", "Ficha no tiene evaluación completada para el calendario seleccionado.", "warning");
      }
      
      
    } catch (error) {
      console.error('Error:', error);
      if (error.status === 502 && !error.error.registros.estadoevaluacion) {
        return Swal.fire("ERROR", "El evaluador no ha completado la evaluación del evaluado para ser calibrada.", "error");
      } 
      if(error.error.registros === "") {
        return Swal.fire("ERROR", "La ficha ingresada no existe.", "error");
      }
    }      
  }

  padLeftWithZeros(value: number | string): string {
    const input = value.toString();
    return input.padStart(8, '0');
  }

  CloseModal(): void{
    this.modalStateService.setAutorizateCalibrationModalHided();
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  onMoveToTarget(event: any) {
    ////console.log('Moved to target:', event.items);
    ////console.log('Lista devuelta: ', this.DataList.length)
    ////console.log('Lista a enviar: ', this.ListToSend)
  }

  onMoveToSource(event: any) {
    ////console.log('Moved to source:', event.items);
    ////console.log('Lista devuelta: ', this.DataList.length)
    ////console.log('Lista a enviar: ', this.ListToSend)
  }

  formatFechaDDMMAAAA(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = ("0" + fecha.getUTCDate()).slice(-2);
    const mes = ("0" + (fecha.getUTCMonth() + 1)).slice(-2)
    const anio = fecha.getUTCFullYear();

    if(fechaISO === undefined){
      return '.....'
    }else{
      return `${dia}/${mes}/${anio}`;
    }
  }

   obtenerSoloFecha(fecha) {
    const [year, month, day] = fecha.toISOString().split('T')[0].split('-');
    return `${year}-${month}-${day}`;
  }


  SendCalibration(): void{
      let nombres: string[] = [];
      let fichas: string[] = []
      for (let personal of this.ListToSend){
        nombres.push(personal.apellidosNombres)
        fichas.push(personal.codigoFicha)
      }
      let nombresHtml = `Se autorizará la calibración de la evaluación de los siguientes trabajadores: <ul>${nombres.map(nombre => `<li>${nombre}</li>`).join('')}</ul>`;
      Swal.fire({
        title:  "Aviso",
        html: nombresHtml,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Autorizar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this,this.utilsService.showLoading();
          let PostBody: ICalibrationSendEvaluatedForAutorization = {
            codFichas: fichas,
            codCalendario: this.PeriodCode,
            fechaLimite: this.obtenerSoloFecha(this.EndCalibrationPeriod),
            codFichaAdmin: "000" + this.DataFromsessionStorage.ficha,
          }
  
          this.calibrationService.PostSendEvaluatedForCalibrationAutorization(PostBody).subscribe({
            next: (data) => {
              Swal.fire({
                title:  "Calibración autorizada",
                text: "La calibración fue autorizada con éxito.",
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
            }
          });
        }
      })
    }
  }


