import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { ICalibrationFindEvaluatedByFicha } from 'src/app/interfaces/ICalibrationFindEvaluatedByFicha';
import { ICalibrationSendEvaluatedForAutorization } from 'src/app/interfaces/ICalibrationSendEvaluatedForAutorization';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { ExceptionService } from 'src/app/services/exception/exception.service';
import { ModalsService } from 'src/app/services/modals.service';
import { TeamService } from 'src/app/services/team/team.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-registerexception',
  templateUrl: './registerexception.component.html',
  styleUrls: ['./registerexception.component.css']
})
export class RegisterexceptionComponent implements OnInit {
  private subscription: Subscription;
  TypeValue: string | any;
  DataFromsessionStorage:ILoginData = this.loginService.GetUserSession();;
  es = {
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
  DataList:ICalibrationFindEvaluatedByFicha[] = [];
  FileValue: string = "";
  TypeAndPeriodName: string = "";
  PeriodCode: string = "";
  date: Date;
  ListToSend: any[] = [];
  fechaEvaluacion: Date = null;
  ExceptionType:string = "";
  hasChangedOnce: boolean = false;
  FilteredFiles: string[] = []
  selectedOption: string = "";
  OrganicUnitOptions: any[] = [];
  OrganicUnitSelection: string = "";
  TeamSelectOptions: any[] = [];
  TeamSelection: string = "";
  visible: boolean = false;
  TeamsErrors: any[] = [];

  constructor(
    private utilsService: UtilsService,  
    private renderer: Renderer2,   
    private calendarService: CalendarService, 
    private loginService: LoginService,
    private calibrationService: CalibrationService,
    private exceptionService: ExceptionService,
    private modalStateService: ModalsService,
    private teamservice: TeamService,
    private utilSergice: UtilsService) { }

  async ngOnInit(): Promise<void | SweetAlertResult> {
    this.utilsService.showLoading()
    try{
      this.subscription = this.modalStateService.getExceptionType().subscribe(value => {
        this.TypeValue = value;
      });
      await this.getCalendarData();
    }catch(error){
     return Swal.fire('Error al obtener el tipo de calendario 90 o 180','','error');
    }
    
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  async getCalendarData(): Promise<any>{
    try{
      const data = await this.calendarService.getDataScheduleApi().toPromise();
      let typeandperiodname: ISchedule = data.registros.filter((item: { tipo: string; }) => item.tipo === this.TypeValue);
      this.TypeAndPeriodName = typeandperiodname[0].vNombre
      this.PeriodCode = typeandperiodname[0].vCodigo
      this.utilsService.closeLoading()
    }catch(error){
      return Swal.fire('Error al obtener los datos del calendario','','error');
    }
  }

  async GetOrganicUnits(): Promise<any>{
    try{
      this.utilsService.showLoading();
      const data = await this.exceptionService.GetOrganicUnitsForException().toPromise();
      //console.log(data)
      this.OrganicUnitOptions = data.registros
      this.utilsService.closeLoading();
    }
    catch(error){
      return Swal.fire('Error al obtener los datos del calendario','','error');
    }
  }
  

  async GetTeamByOrganicUnit(): Promise<any> {
    const BodyToSendToTeam = [this.OrganicUnitSelection];
    console.log("gerencia: ");
    console.log(BodyToSendToTeam);
  
    try {
      this.utilsService.showLoading();
      const response = await this.teamservice.getDataTeamApi(BodyToSendToTeam).toPromise();
      if(response.registros.length != 0){
        this.TeamSelectOptions = response.registros;
        this.utilsService.closeLoading();
      }else{
        return Swal.fire('No se encontraron equipos','','warning');
      }
    } catch (error) {
      return Swal.fire('Error al obtener los datos del los equipos','','error');
    }
  }
  
  

  async GetData(): Promise<any>{
    this.utilsService.showLoading();
    try {
      let newValueWithZeros = this.padLeftWithZeros(this.FileValue);
      const data = await this.exceptionService.GetWorkerForException(this.ExceptionType,newValueWithZeros, this.PeriodCode).toPromise();
      if (!this.FilteredFiles.includes(newValueWithZeros)) {
        if(data){
          try {
            const evaluatedValidation: any = await this.utilsService.GetEvaluatorStatusForPhase(this.ExceptionType,'ficha',newValueWithZeros,this.PeriodCode).toPromise();      
            if (data.registros.habilitaExcepcion) {
                this.FileValue = "";
                this.DataList.push(data.registros.evaluado);
                this.FilteredFiles.push(data.registros.evaluado.codigoFicha);
                this.utilsService.closeLoading();
              } else {
                Swal.fire('INFO', data.registros.observacion, 'info'); 
              }  
          } catch (error) {
            if (error.status === 502) {
              Swal.fire(
                'AVISO',
                `${error.error.mensaje}.`,
                'warning'
              );
            } else {
              Swal.fire(
                'Error',
                'Ocurrió un error inesperado.',
                'error'
              );
            }
          }
          
        }
      }else{
        return Swal.fire("INFO", "La ficha ingresada ya se encuentra dentro del listado de Disponibles", "info");
      }
    } catch (error) {
      if(error.error.registros === "") {
        this.ExceptionType='';
        this.selectedOption='';
        this.FileValue='';
        return Swal.fire("ERROR", "La ficha ingresada no existe", "error");
      }
    }      
  }

  padLeftWithZeros(value: number | string): string {
    const input = value.toString();
    return input.padStart(8, '0');
  }
  

  async onExceptionTeamChange(event: any): Promise<void> {
    console.log("equipo: ");
    console.log(event.value);
    this.TeamSelection = event.value;
    this.utilsService.showLoading();
  
    try {
      const data = await this.exceptionService.GetWorkerForExceptionFindByTeam(
        this.ExceptionType,
        this.TeamSelection,
        this.PeriodCode
      ).toPromise();
  
      if (data) {
        this.DataList = [];
        this.TeamsErrors = [];
        for (let item of data.registros) {
          try {
            const evaluatedValidation: any = await this.utilSergice.GetEvaluatorStatusForPhase(
              this.ExceptionType,
              'ficha',
              item.evaluado.codigoFicha,
              this.PeriodCode
            ).toPromise();
  
            if (item.habilitaExcepcion) {
              this.DataList.push(item.evaluado);
            }
          } catch (error) {
            if (error.status === 502) {
              let BodyToPushError = {
                evaluado_nombre: item.evaluado.apellidosNombres,
                error: error.error.mensaje,
              }
              this.TeamsErrors.push(BodyToPushError);
            } else {
              Swal.fire(
                'Error',
                'Ocurrió un error inesperado.',
                'error'
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error al obtener los datos del equipo:', error);
      Swal.fire(
        'Error',
        'No se pudo cargar los datos del equipo. Por favor, intente nuevamente.',
        'error'
      );
    } finally {
      this.utilsService.closeLoading();
    }
  }

  async onUnidadOrganica(event: any): Promise<void> {
    console.log("UO : ");
    console.log(event.value);
    this.TeamSelection = event.value;
    this.utilsService.showLoading();
  
    try {
      const data = await this.exceptionService.GetWorkerForExceptionFindByTeam(
        this.ExceptionType,
        this.TeamSelection,
        this.PeriodCode
      ).toPromise();
  
      if (data) {
        this.DataList = [];
        this.TeamsErrors = [];
        if (data.registros.length==0){
           Swal.fire(
                'Error',
                'No existe evaluaciones asignadas en esta Unidad Orgánica.',
                'error'
              );
        } else {
        for (let item of data.registros) {
          try {
            const evaluatedValidation: any = await this.utilSergice.GetEvaluatorStatusForPhase(
              this.ExceptionType,
              'ficha',
              item.evaluado.codigoFicha,
              this.PeriodCode
            ).toPromise();
  
            if (item.habilitaExcepcion) {
              this.DataList.push(item.evaluado);
            }
          } catch (error) {
            if (error.status === 502) {
              let BodyToPushError = {
                evaluado_nombre: item.evaluado.apellidosNombres,
                error: error.error.mensaje,
              }
              this.TeamsErrors.push(BodyToPushError);
            } else {
              Swal.fire(
                'Error',
                'Ocurrió un error inesperado.',
                'error'
              );
            }
          }
        }
         this.utilsService.closeLoading();
      }
      }
    } catch (error) {
      console.error('Error al obtener los datos del equipo:', error);
      Swal.fire(
        'Error',
        'No se pudo cargar los datos del equipo. Por favor, intente nuevamente.',
        'error'
      );
    } finally {
     
    }
  }

  showDialog() {
    this.visible = true;
  }
  

  CloseModal(): void{
    this.modalStateService.setExceptionModalVisibleHided();
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

  onRadioChange(event: any): void{
    if(event.value === 'equipo'){
      //console.log('Cargando uo..');
      this.GetOrganicUnits();
    }
    this.selectedOption = event.value;
    this.DataList = [], 
    this.FilteredFiles = []
    this.ListToSend = [];
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


  SendException(): void{
      let nombres: string[] = [];
      let fichas: string[] = []
      for (let personal of this.ListToSend){
        nombres.push(personal.apellidosNombres)
        fichas.push(personal.codigoFicha)
      }
      let excepctionName = this.ExceptionType
      if(excepctionName === 'PID_EST'){
        excepctionName = 'PID registro';
      }
      if(excepctionName === 'PID_EVAL'){
        excepctionName = 'PID cumplimiento';
      }
      let nombresHtml = `Se registrara la excepción del tipo ${excepctionName} a los siguientes trabajadores: <ul>${nombres.map(nombre => `<li>${nombre}</li>`).join('')}</ul>`;
      Swal.fire({
        title:  "Aviso",
        html: nombresHtml,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this,this.utilsService.showLoading();
          let PostBody: any = {
            codFichas: fichas,
            codCalendario: this.PeriodCode,
            fechaLimite: this.obtenerSoloFecha(this.fechaEvaluacion),
            codFichaAdmin: "000" + this.DataFromsessionStorage.ficha,
            fase: this.ExceptionType
          }
          //console.log(PostBody)
          this.exceptionService.PostSaveAndSendWorkersForException(PostBody).subscribe({
            next: (data) => {
              Swal.fire({
                title:  "Excepción registrada",
                text: "La excepción fue registrada con éxito.",
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


