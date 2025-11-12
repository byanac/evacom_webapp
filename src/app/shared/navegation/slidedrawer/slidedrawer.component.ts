import { Component, OnInit, Renderer2, isDevMode } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription, forkJoin } from 'rxjs';

import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { MenuItem } from 'src/app/interfaces/MenuItem';
import { SubMenu } from 'src/app/interfaces/SubMenu';

import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import Swal from 'sweetalert2';

import { AdminActionsOptions } from 'src/app/core/navconst/AdminActionsOptions';
import { OutStandingFacts } from 'src/app/core/navconst/OutStaindingFacts';
import { EvaluatorEvaluationItems } from 'src/app/core/navconst/EvaluatorEvaluationItems';
import { AdminCalibrationItems } from 'src/app/core/navconst/AdminCalibrationItems';
import { EvaluatorOptions } from 'src/app/core/navconst/EvaluatorOptions';
import { AdminMenuItems } from 'src/app/core/navconst/AdminMenuItems';
import { EvaluatedMenuItems } from 'src/app/core/navconst/EvaluatedMenuItems';
import { ModalsService } from 'src/app/services/modals.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { AdminParametrizationItems } from 'src/app/core/navconst/AdminParametrizationItems';
import { AdminExceptionItems } from 'src/app/core/navconst/AdminExceptionItems';
import { AdminHistoricItems } from 'src/app/core/navconst/AdminHistoricItems';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { EvaluatedPIDMenuItems } from 'src/app/core/navconst/EvaluatedPIDMenuItems';
import { AddoutstandingfactmodalService } from 'src/app/services/addoutstandingfactmodal/addoutstandingfactmodal.service';

@Component({
  selector: 'app-slidedrawer',
  templateUrl: './slidedrawer.component.html'
})
export class SlidedrawerComponent implements OnInit {
  userLoginOn : boolean = false;
  userData:ILoginData;
  showSubMenu: boolean = false;
  showSubMobile: boolean = false;
  showdeskOptionMenu: boolean = false;
  displayAdminReportOptions: boolean = false;
  displayAdminActionOptions: boolean = false;
  displayEvaluationOptions: boolean = false;
  displayACMOptions: boolean = false;
  ScheduleData!: ISchedule;
  FactsData: IEvaluatedFacts;
  visible: boolean = false;
  EvaluatedCalendarCode = "";
  ModalValue: boolean;
  ACMValue: boolean;
  ACMTypeSended: string;
  toggleadminoptions: boolean = false;
  ModalSubscription: Subscription;
  ACMSubscription:Subscription;
  toggleAdminActionItems: boolean  = false;
  toggleAdminCalibrationItems: boolean = false;
  toggleAdminReportItems: boolean  = false;
  displayParamOptions: boolean = false;
  AdminExceptionOptions: boolean = false;
  HistoricReportsOption: boolean = false;
  showEvaluatedPIDOptions: boolean = false;

  AdminReportOptions: MenuItem [] = AdminMenuItems;
  AdminActionsOptions: MenuItem [] = AdminActionsOptions;
  AdminCalibrationItems: SubMenu [] = AdminCalibrationItems;
  AdminParametrizationItems: SubMenu [] = AdminParametrizationItems;
  AdminExceptionItems: SubMenu [] = AdminExceptionItems;
  AdminHistoricItems: SubMenu [] = AdminHistoricItems;

  EvaluatorOptions: MenuItem [] = EvaluatorOptions;
  EvaluatorEvaluationItems: SubMenu [] = EvaluatorEvaluationItems;

  EvaluatedMenuItems: MenuItem[] = EvaluatedMenuItems;
  EvaluatedPIDMenuItems: MenuItem[] = EvaluatedPIDMenuItems;

  OutStaindingFacts: MenuItem [] = OutStandingFacts;

  filteredCalendar: any = null;
  filteredCalendarEvaluator: any = null;
  CurrentCalendars: any = [];
  EvaluatedExceptionFlags: any = [];
  EvaluatorExceptionFlags: any[] = [];
  LoadedEvaluatedExceptionFlags: boolean = false;
  LoadedEvaluatorExceptionFlags: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor( 
    private calendarService: CalendarService, 
    private router: Router, 
    private renderer: Renderer2, 
    private sanitizer: DomSanitizer,
    public  loginService: LoginService,
    private modalStateService: ModalsService,
    private configurationService: ConfigurationService,
    private utilService: UtilsService,
    private pidService: PidService,
    private Factsservice: AddoutstandingfactmodalService
  ){}
  
  //////////////////

  async LoadEvaluatedPIDAccess(): Promise<any>{
    try{
      this.utilService.showLoading();
      const data = await this.pidService.GetPIDEvaluatedValidation(this.loginService.GetUserSession().ficha,this.loginService.GetUserSession().codPuesto,this.loginService.isUserEvaluated().codCalendario).toPromise();
      this.showEvaluatedPIDOptions = data.registros
      this.utilService.closeLoading();
    }catch (error) {
      console.error('Error al cargar los permisos de PID del evaluado:', error);
      return Swal.fire('Error al cargar los permisos de PID del evaluado', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => this.router.navigate(['/login']));;
    }
  }

  async getFilteredCalendarDates(): Promise<any> {
    try {
      if (this.CurrentCalendars) {
        
        const registro: any = this.CurrentCalendars.registros.find((item: { vCodigo: string }) => item.vCodigo === this.loginService.isUserEvaluated().codCalendario);
        if (!registro) {
          //console.log('No se encontró un registro con el vCodigo especificado.');
          return null;
        }
  
        return registro;
      } else {
        //console.log('No se obtuvo data de la API.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener datos del calendario:', error);
      return null;
    }
  }

  async getFilteredCalendarDatesEvaluator(): Promise<{ EvaluadorDosCalendarios: boolean, DataCalendarios: any[], EvaluadorJefe90: boolean, EvaluadorJefe180: boolean }> {
    try {
        if (!this.CurrentCalendars) {
            //console.log('No se obtuvo data de la API.');
            return null;
        }

        const userEvaluator = this.loginService.isUserEvaluator();
        const calendario90 = userEvaluator && userEvaluator.codCalendario ? userEvaluator.codCalendario.calendario90 : null;
        const calendario180 = userEvaluator && userEvaluator.codCalendario ? userEvaluator.codCalendario.calendario180 : null;
        const EvaluadorJefe90 = userEvaluator && userEvaluator.evaluadorjefe ? userEvaluator.evaluadorjefe.EvaluadorJefe90 : false;
        const EvaluadorJefe180 = userEvaluator && userEvaluator.evaluadorjefe ? userEvaluator.evaluadorjefe.EvaluadorJefe180 : false;
        const CalendarsData: any[] = [];

        if (userEvaluator.codCalendario.length === 1) {
            if (userEvaluator.codCalendario[0].calendario90) {
                const calendar90 = this.CurrentCalendars.registros.find((item: { vCodigo: string }) => item.vCodigo === userEvaluator.codCalendario[0].calendario90);
                if (calendar90) {
                    CalendarsData.push(calendar90);
                    //console.log('Es evaluador en un solo calendario de 90°.');
                    return {
                        EvaluadorDosCalendarios: false,
                        DataCalendarios: CalendarsData,
                        EvaluadorJefe90: true,
                        EvaluadorJefe180: false
                    };
                }
            }

            if (userEvaluator.codCalendario[0].calendario180) {
                const calendar180 = this.CurrentCalendars.registros.find((item: { vCodigo: string }) => item.vCodigo === userEvaluator.codCalendario[0].calendario180);
                if (calendar180) {
                    CalendarsData.push(calendar180);
                    //console.log('Es evaluador en un solo calendario de 180°.');
                    return {
                        EvaluadorDosCalendarios: false,
                        DataCalendarios: CalendarsData,
                        EvaluadorJefe90: false,
                        EvaluadorJefe180: userEvaluator.evaluadorjefe
                    };
                }
            }
        }

        if (calendario90) {
            const calendar90 = this.CurrentCalendars.registros.find((item: { vCodigo: string }) => item.vCodigo === calendario90);
            if (calendar90) {
                CalendarsData.push(calendar90);
            }
        }

        if (calendario180) {
            const calendar180 = this.CurrentCalendars.registros.find((item: { vCodigo: string }) => item.vCodigo === calendario180);
            if (calendar180) {
                CalendarsData.push(calendar180);
            }
        }

        const isDualEvaluator = !!calendario90 && !!calendario180;

        const CalendarDataEvaluator = {
            EvaluadorDosCalendarios: isDualEvaluator, 
            DataCalendarios: CalendarsData,      
            EvaluadorJefe90: !!EvaluadorJefe90,    
            EvaluadorJefe180: !!EvaluadorJefe180  
        };

        //console.log(CalendarDataEvaluator)
        return CalendarDataEvaluator;
    } catch (error) {
        console.error('Error al obtener datos del calendario:', error);
        return null;
    }
  }

  VerifyEvaluatedRangedDates(campoInicio: string, campoFin: string,fecha:string): boolean {
    if (!this.filteredCalendar) {
      return false;
    }
  
    try {
      const fechaInicio = new Date(`${this.filteredCalendar[campoInicio]}T00:00:00`);
      const fechaFin = new Date(`${this.filteredCalendar[campoFin]}T00:00:00`);
      let fechaActual: Date;
        if (fecha) {
          const [dia, mes, anio] = fecha.split('/').map(Number);
          fechaActual = new Date(`${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}T00:00:00`);
        } else {
          fechaActual = new Date();
        }

      // Validar que las fechas sean válidas
      if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
        console.warn(`Fechas no válidas en el calendario. Campo Inicio: ${campoInicio}, Campo Fin: ${campoFin}`);
        return false;
      }

      //return true;
      return fechaActual >= fechaInicio && fechaActual <= fechaFin;
      // if(isDevMode()){
      //   return true
      // }else{
      //   return fechaActual >= fechaInicio && fechaActual <= fechaFin;
      // }
      //return fechaActual >= fechaInicio && fechaActual <= fechaFin;
    } catch (error) {
      console.error('Error al verificar las fechas:', error);
      return false;
    }
  }
  
  VerifyEvaluatorRangedDates(campoInicio: string, campoFin: string): boolean {
    if (!this.filteredCalendarEvaluator || !this.filteredCalendarEvaluator.DataCalendarios || !campoInicio || !campoFin) {
      return false;
    }
  
    try{
      const fechaActual = new Date(); 
  
      if (this.filteredCalendarEvaluator.DataCalendarios.length === 1) {
        const calendario = this.filteredCalendarEvaluator.DataCalendarios[0];
        const fechaInicio = new Date(`${calendario[campoInicio]}T00:00:00`);
        const fechaFin = new Date(`${calendario[campoFin]}T00:00:00`);
  
        // Validar que las fechas sean válidas
        if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
          console.warn(`Fechas no válidas en el calendario: ${calendario.vNombre}`);
          return false;
        }
        return true
        // Comparar fecha actual con el rango
        // if(isDevMode()){
        //   return true
        // }else{
        //   return fechaActual >= fechaInicio && fechaActual <= fechaFin;
        // }
        //return fechaActual >= fechaInicio && fechaActual <= fechaFin;
      }else{
        let fechaMasLejanaInicio: Date | null = null;
        let fechaMasLejanaFin: Date | null = null;
  
        this.filteredCalendarEvaluator.DataCalendarios.forEach(calendario => {
          const fechaInicio = new Date(`${calendario[campoInicio]}T00:00:00`);
          const fechaFin = new Date(`${calendario[campoFin]}T00:00:00`);
  
          // Validar que las fechas sean válidas
          if (!isNaN(fechaInicio.getTime()) && (!fechaMasLejanaInicio || fechaInicio < fechaMasLejanaInicio)) {
            fechaMasLejanaInicio = fechaInicio;
          }
  
          if (!isNaN(fechaFin.getTime()) && (!fechaMasLejanaFin || fechaFin > fechaMasLejanaFin)) {
            fechaMasLejanaFin = fechaFin;
          }
        });
  
        if (fechaMasLejanaInicio && fechaMasLejanaFin) {
          return true
          // if(isDevMode()){
          //   return true
          // }else{
          //   return fechaActual >= fechaMasLejanaInicio && fechaActual <= fechaMasLejanaFin;
          // }
          //return fechaActual >= fechaMasLejanaInicio && fechaActual <= fechaMasLejanaFin;
        }
  
        return false;
      }
    } catch (error) {
      console.error('Error al verificar las fechas:', error);
      return false;
    }
  }
  
  FindEvaluatedFlagValue(flagName: string): boolean {
    if(this.EvaluatedExceptionFlags.length !== 0){
        return this.EvaluatedExceptionFlags[flagName]
    }
  }

  FindEvaluatorFlagValue(flagName: string): boolean {
    if(this.EvaluatorExceptionFlags.length != 0){

      switch (this.EvaluatorExceptionFlags.length) {
        case 1:
          return this.EvaluatorExceptionFlags[0][flagName];
        case 2:
          return this.EvaluatorExceptionFlags[0][flagName] || this.EvaluatorExceptionFlags[1][flagName];
        default:
          ////console.log('ERROR')
          return false;
      }
    }
  }

    //////////////////


    async ngOnInit(): Promise<void | boolean> {
      this.utilService.showLoading();
      
      try {
        if(this.loginService.GetUserSession()){
          const isAdmin = this.loginService.IsUserAdmin();
          const isEvaluated = this.loginService.isUserEvaluated();
          
          const isEvaluator = this.loginService.isUserEvaluator();

       

          //await new Promise(resolve => setTimeout(resolve, 1500));
          
          if ((isEvaluated && isEvaluated.estadoEvaluado) || (isEvaluator && isEvaluator.estadoEvaluador)) {
    
            const calls = [this.calendarService.getDataScheduleApi()]; 

            if (isEvaluated && isEvaluated.estadoEvaluado) {
              calls.push(this.Factsservice.GetOutStandingFactsFromWorker(this.loginService.GetUserSession().ficha));
            }
            const results = await forkJoin(calls).toPromise();
            const CurrentCalendarsData = results[0];
            this.CurrentCalendars = CurrentCalendarsData;
            
            const ActivesCalendars90 = this.CurrentCalendars.registros.filter((data: { tipo: string; }) => data.tipo === '90').length; 
            const ActivesCalendars180 = this.CurrentCalendars.registros.filter((data: { tipo: string; }) => data.tipo === '180').length; 
        
            if(!this.loginService.IsUserAdmin()){
              if(ActivesCalendars90 > 1){
                this.utilService.closeLoading();
                return Swal.fire("Aviso", "Se han detectado 2 calendarios del tipo 90° vigentes. Por favor, contacte con el administrador.", "warning").then(() => this.router.navigate(['/login']));
              }
        
              if(ActivesCalendars180 > 1){
                this.utilService.closeLoading();
                return Swal.fire("Aviso", "Se han detectado 2 calendarios del tipo 180° vigentes. Por favor, contacte con el administrador.", "warning").then(() => this.router.navigate(['/login']));
              }
            }
            
            if (isEvaluated.estadoEvaluado) {
              //console.log('INGRESÓ UN EVALUADO')
              this.FactsData = results[1]; 
              this.filteredCalendar = await this.getFilteredCalendarDates();
              
              const EvaluatedExceptionFlags = await this.loginService.GetEvaluatedExceptionFlags().toPromise();
              this.EvaluatedExceptionFlags =  EvaluatedExceptionFlags.registros
              this.LoadedEvaluatedExceptionFlags = true;
              await this.LoadEvaluatedPIDAccess();
            }
        
            if(isEvaluator.estadoEvaluador){
              //console.log('INGRESÓ UN EVALUADOR')
              this.filteredCalendarEvaluator = await this.getFilteredCalendarDatesEvaluator();
              for(let calendar of this.filteredCalendarEvaluator.DataCalendarios){
                let data = await this.loginService.GetEvaluatorExceptionFlags(calendar.vCodigo).toPromise();
                if(data){
                  this.EvaluatorExceptionFlags.push(data.registros)
                }
              }
              this.LoadedEvaluatorExceptionFlags = true;
            } 
            //console.log('Datos del nav se han cargado con éxito.')
          }
          this.utilService.closeLoading();

           if ((!isAdmin) && (!isEvaluated.estadoEvaluado) && (!isEvaluator.estadoEvaluador)) {
            Swal.fire('Aviso','No cuenta con evaluaciones asignadas.','warning');
            }
        }
        
      } catch (error) {
        Swal.fire('ERROR','Hubo un error al procesar los permisos del usuario.','error').then(() => this.router.navigateByUrl('/login'))
      }
    }



  ToggleAdminCalibrationItems():void{
    this.toggleAdminCalibrationItems = !this.toggleAdminCalibrationItems;
    this.toggleAdminReportItems = false;
    this.toggleAdminActionItems = false
  }

  ToggleAdminReportItems(): void{
    this.toggleAdminReportItems = !this.toggleAdminReportItems;
    this.toggleAdminCalibrationItems = false;
    this.toggleAdminActionItems = false;
  }

  ToggleAdminActionItems(): void{
    this.toggleAdminActionItems = !this.toggleAdminActionItems;
    this.toggleAdminReportItems= false;
    this.toggleAdminCalibrationItems = false;
  }

  getSanitizedSvg(svgContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

  closeSesion(){
    sessionStorage.clear();
    return this.router.navigate(['/login']);
  }

  toggleadminreportoptions():void{
    this.displayAdminReportOptions = !this.displayAdminReportOptions;   
  }

  toggleadminactionoptions():void{
    this.displayAdminActionOptions = !this.displayAdminActionOptions;   
  }

  toggledisplayParamOptions(): void{
    this.displayParamOptions = !this.displayParamOptions;
  }

  toggleevaluationoptions():void{
    this.displayEvaluationOptions = !this.displayEvaluationOptions;   
  }

  toggleACMoptions():void{
    this.displayACMOptions = !this.displayACMOptions;
  }
  
  toggleAdminExceptionOptions():void{
    this.AdminExceptionOptions = !this.AdminExceptionOptions;
  }

  toggleHistoricReportsOptions():void{
    this.HistoricReportsOption = !this.HistoricReportsOption;
  }

  ShowConsolidatedModal(): void{
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    this.modalStateService.setEvalConsolidatedReportModalVisible();
    this.configurationService.ToggleMenu();
  }

  closeModal(event: boolean) {
    this.ModalValue = event;
  }

  ShowModalACM(typeText: string): void{
    this.modalStateService.setautorizateCalibrationModalType(typeText);
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    this.modalStateService.setAutorizateCalibrationModalVisible();
    this.configurationService.ToggleMenu();
  }

  ShowModalException(typeText: string): void{
    this.modalStateService.setExceptionModalType(typeText);
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    this.modalStateService.setExceptionModalVisible();
    this.configurationService.ToggleMenu();
  }

  closeModalACM(event: boolean) {
    this.ACMValue = event;
  }

  showFactsDialog() {
    if(this.FactsData.registros.length !== 0){
      this.modalStateService.setFactsDataModalVisible()
      this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
      this.configurationService.ToggleMenu();
    }else{
      return Swal.fire('No tienes hechos resaltantes registrados', "Aún no se te han registrado hechos resaltantes", "info")
    }
  }

  closeMenu(): void {
    this.configurationService.ToggleMenu();
  }

  goHome(){
    return this.router.navigateByUrl('/home');
  }

}