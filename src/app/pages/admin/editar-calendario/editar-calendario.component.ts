import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { GerencyService } from 'src/app/services/gerency/gerency.service';  //PROY-00013
import { TeamService } from 'src/app/services/team/team.service';//PROY-00013

@Component({
  selector: 'app-editar-calendario',
  templateUrl: './editar-calendario.component.html',
  styleUrls: ['./editar-calendario.component.css']
})
export class EditarCalendarioComponent implements OnInit {
  AdminData = this.loginService.GetUserSession();
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  calendarioForm: FormGroup;
  ViewPlanDesarrolloDetail: boolean = false
  CalendarData: ISchedule;
  CalendarPeriodicites: any[] = []
  fases: string[] = [
    'parametrizacion', 'conocimiento', 'autoevaluacion', 'evaluacion',
    'calibracion', 'retroalimentacion', 'planDesarrollo', 'reporteFinal'
  ];
  PIDFases: any[] = [
    {
      label: 'Registro y Validación',
      formcontrolname: 'EstablecimientoYAprobaciónPID'
    },
    {
      label: 'Registro de Cumplimiento, Validación y Seguimiento',
      formcontrolname: 'RegistroYEvaluaciónCumplimientoPID'
    }
  ]
  LoadedCalendarData: any

  //INI PROY-00013 RFC
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private calendarService: CalendarService, private utilsService: UtilsService, private route: ActivatedRoute, private router: Router, private loginService: LoginService,  private gerencyService:GerencyService,private teamService:TeamService) {}

  async ngOnInit(): Promise<any> {
    this.initForm();
    this.utilsService.showLoading();
    debugger
    const data = await this.calendarService.GetCalendarPeriodicities().toPromise();
    this.CalendarPeriodicites = data.registros;
  
    const scheduleData = await this.calendarService.getCalendarVigencies().toPromise();
    let datafiltered = scheduleData.registros.find((data: { vCodigo: string; }) => data.vCodigo === this.CalendarID); 

    if(datafiltered === undefined || datafiltered === null){
      return Swal.fire("No se ha encontrado el calendario", "No se ha encontrado la información del calendario seleccionado.", "error").then(() => {
        this.router.navigateByUrl('/home');
    });
    }else{
      this.LoadedCalendarData = datafiltered;
      //console.log(this.LoadedCalendarData);
      this.OnLoadPatchValues();
      this.utilsService.closeLoading();
    }
  }
  

  initForm() {
    this.calendarioForm = this.fb.group({
      tipo: ['', Validators.required],
      calnombre: ['', Validators.required],
      periodicidad: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      fases: this.fb.group({
        parametrizacion: this.createFaseGroup(),
        conocimiento: this.createFaseGroup(),
        autoevaluacion: this.createFaseGroup(),
        evaluacion: this.createFaseGroup(),
        calibracion: this.createFaseGroup(),
        retroalimentacion: this.createFaseGroup(),
        planDesarrollo: this.fb.group({
          EstablecimientoYAprobaciónPID: this.createFaseGroup(),
          RegistroYEvaluaciónCumplimientoPID: this.createFaseGroup()
        }),
        reporteFinal: this.createFaseGroup(),
      })
    });
  }

  OnLoadPatchValues(): void{
    this.calendarioForm.get('tipo').patchValue(this.LoadedCalendarData.tipo);
    this.calendarioForm.get('periodicidad').patchValue(this.LoadedCalendarData.periodicidad.codigo);
    this.calendarioForm.get('calnombre').patchValue(this.LoadedCalendarData.vNombre);
    this.calendarioForm.get('fechaInicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dPeriodoIni));
    this.calendarioForm.get('fechaFin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dPeriodoFin));
    this.calendarioForm.get('fases').get('parametrizacion').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dParamIni));
    this.calendarioForm.get('fases').get('parametrizacion').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dParamFin));
    this.calendarioForm.get('fases').get('conocimiento').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dConoIni));
    this.calendarioForm.get('fases').get('conocimiento').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dConocFin));
    this.calendarioForm.get('fases').get('autoevaluacion').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dAutoIni));
    this.calendarioForm.get('fases').get('autoevaluacion').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dAutoFin));
    this.calendarioForm.get('fases').get('evaluacion').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dEvalIni));
    this.calendarioForm.get('fases').get('evaluacion').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dEvalFin));
    this.calendarioForm.get('fases').get('calibracion').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dCalibIni));
    this.calendarioForm.get('fases').get('calibracion').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dCalibFin));
    this.calendarioForm.get('fases').get('retroalimentacion').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dRetroIni));
    this.calendarioForm.get('fases').get('retroalimentacion').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dRetroFin));
    this.calendarioForm.get('fases').get('planDesarrollo').get('EstablecimientoYAprobaciónPID').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dPidEstIni));
    this.calendarioForm.get('fases').get('planDesarrollo').get('EstablecimientoYAprobaciónPID').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dPidEstFin));
    this.calendarioForm.get('fases').get('planDesarrollo').get('RegistroYEvaluaciónCumplimientoPID').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dPidEvalIni));
    this.calendarioForm.get('fases').get('planDesarrollo').get('RegistroYEvaluaciónCumplimientoPID').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dPidEvalFin));
    this.calendarioForm.get('fases').get('reporteFinal').get('inicio').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dReporIni));
    this.calendarioForm.get('fases').get('reporteFinal').get('fin').patchValue(this.LoadFormatedDates(this.LoadedCalendarData.dReporFin));
  }

  createFaseGroup() {
    return this.fb.group({
      inicio: ['', Validators.required],
      fin: ['', Validators.required]
    });
  }

  formatDateToYYYYMMDD(dateString) {
    // Convierte la cadena de fecha en un objeto Date
    const date = new Date(dateString);

    // Obtiene los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0 a 11, así que se suma 1
    const day = String(date.getDate()).padStart(2, '0');

    // Formatea la fecha como AAAA-MM-DD
    return `${year}-${month}-${day}`;
  }

  LoadFormatedDates(dateString): Date{
    const [year, month, day] = dateString.split('-').map(Number);
    const fecha = new Date(year, month - 1, day, 0, 0, 0);
    return fecha
  }

  onSubmit() {
    if (this.calendarioForm.valid) {
      Swal.fire({
        title: "Aviso",
        text: `¿Estás seguro de actualizar el calendario?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading()
          let BodyToPost: any = {
            vCodigo: this.LoadedCalendarData.vCodigo,
            vNombre: this.calendarioForm.get('calnombre').value,
            tipo: this.calendarioForm.get('tipo').value,
            periodo: this.calendarioForm.get('calnombre').value,
            dPeriodoIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fechaInicio').value),
            dPeriodoFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fechaFin').value),
            dParamIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('parametrizacion').get('inicio').value),
            dParamFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('parametrizacion').get('fin').value),
            dConoIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('conocimiento').get('inicio').value),
            dConocFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('conocimiento').get('fin').value),
            dHechosIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fechaInicio').value),
            dHechosFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fechaFin').value),
            dAutoIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('autoevaluacion').get('inicio').value),
            dAutoFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('autoevaluacion').get('fin').value),
            dEvalIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('evaluacion').get('inicio').value),
            dEvalFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('evaluacion').get('fin').value),
            dCalibIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('calibracion').get('inicio').value),
            dCalibFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('calibracion').get('fin').value),
            dRetroIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('retroalimentacion').get('inicio').value),
            dRetroFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('retroalimentacion').get('fin').value),
            dPidEstIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('planDesarrollo').get('EstablecimientoYAprobaciónPID').get('inicio').value),
            dPidEstFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('planDesarrollo').get('EstablecimientoYAprobaciónPID').get('fin').value),
            dPidEvalIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('planDesarrollo').get('RegistroYEvaluaciónCumplimientoPID').get('inicio').value),
            dPidEvalFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('planDesarrollo').get('RegistroYEvaluaciónCumplimientoPID').get('fin').value),
            dReporIni: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('reporteFinal').get('inicio').value),
            dReporFin: this.formatDateToYYYYMMDD(this.calendarioForm.get('fases').get('reporteFinal').get('fin').value),
            periodicidad: {
              codigo: this.calendarioForm.get('periodicidad').value,
            },
            codFichaAdmin: this.AdminData.ficha
          };
          this.calendarService.PutUpdateCalendar(BodyToPost).subscribe({
            next: (data) => {
              debugger
              /*INI PROY-00013 RFC*/
              this.gerencyService.UpdateGerencyAPI().subscribe({
                next: (dataGerencia) => {
                  console.log('Gerencias actualizadas:', dataGerencia);
                  this.teamService.UpdateTeamAPI().subscribe({
                    next: (dataEquipos) => {
                      console.log('Equipos actualizados:', dataEquipos);
                    },
                    error: (errorEquipos) => {
                      console.error('Error al cargar equipos:', errorEquipos.message);
                      Swal.fire('Error al cargar equipos.', '', 'error');
                      this.utilsService.closeLoading();
                    }
                  });
                },
                error: (errorGerencias) => {
                  console.error('Error al cargar gerencias:', errorGerencias.message);
                  Swal.fire('Error al cargar gerencias.', '', 'error');
                  this.utilsService.closeLoading();
                }
                /*INI PROY-00013 RFC*/
              });
              Swal.fire("Calendario editado", "El calendario fue editado con éxito.", "success").then(() => {
                return this.router.navigateByUrl('/home/gestion-calendario');
              })
              //////////console.log(data)
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al editar calendario", error.error.mensaje, "error");
            }
          });
        }
      })
    } else {
      Swal.fire("ALERTA", "Por favor, completa todos los campos para continuar.", 'warning')
    }
  }

  getFaseControl(fase: string) {
    return this.calendarioForm.get('fases') ? this.calendarioForm.get('fases').get(fase) as FormGroup : null;
  }
  
  getPlanDesarrolloControl(subfase: string) {
    return this.calendarioForm.get('fases') && this.calendarioForm.get('fases').get('planDesarrollo')
      ? this.calendarioForm.get('fases').get('planDesarrollo').get(subfase) as FormGroup
      : null;
  }
  
  changeViewPlanDesarrolloDetail(): void{
    this.ViewPlanDesarrolloDetail ? this.ViewPlanDesarrolloDetail = false : this.ViewPlanDesarrolloDetail = true
  }

  formatFaseName(fase: string): string {
    return fase.replace(/([A-Z])/g, ' $1').trim();
  }

  formatFecha(fecha: Date): string {
    return this.datePipe.transform(fecha, 'dd/MM/yyyy') || '';
  }

  endsWithOn(input: string): string {
    let result: string = '';
    input.endsWith("on") ? result = input.slice(0, -2) + "ón" : result = input
    return result 
  }

  seleccionarAnio(normalizedYear: Date, datepicker: any) {
    this.calendarioForm.controls['anio'].setValue(normalizedYear);
    datepicker.close();
  }
  
  CancelButton(){
    return this.router.navigateByUrl('/home/gestion-calendario');
  }
}