import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/auth/login.service';
import { GerencyService } from 'src/app/services/gerency/gerency.service';  //PROY-00013
import { TeamService } from 'src/app/services/team/team.service';//PROY-00013
import { ExceptionService } from 'src/app/services/exception/exception.service';

@Component({
  selector: 'app-registro-calendario',
  templateUrl: './registro-calendario.component.html',
  styleUrls: ['./registro-calendario.component.css'],
  providers: [DatePipe]
})
export class RegistroCalendarioComponent implements OnInit {
  AdminData = this.loginService.GetUserSession();
  calendarioForm: FormGroup;
  ViewPlanDesarrolloDetail: boolean = false
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
  //PROY-00013
  constructor(private fb: FormBuilder, private datePipe: DatePipe, private calendarService: CalendarService, private utilsService: UtilsService, private loginService: LoginService, private router: Router, private gerencyService:GerencyService,private teamService:TeamService) {}

  async ngOnInit(): Promise<any> {
    this.initForm();
    this.utilsService.showLoading();
    const data = await this.calendarService.GetCalendarPeriodicities().toPromise()
    this.CalendarPeriodicites = data.registros;
    this.utilsService.closeLoading();
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

  onSubmit() {
    if (this.calendarioForm.valid) {
      Swal.fire({
        title: "Aviso",
        text: `¿Estás seguro de registrar el calendario?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading()
          let BodyToPost: any = {
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
          this.calendarService.PostInsertCalendar(BodyToPost).subscribe({
            next: (data) => {
              /*INI PROY-0013*/
              //this.gerencyService.UpdateGerencyAPI();
              //this.teamService.UpdateTeamAPI();
              this.gerencyService.UpdateGerencyAPI().subscribe({
                next: (dataGerencia) => {
                  console.log('Gerencias actualizadas:', dataGerencia);
                  this.teamService.UpdateTeamAPI().subscribe({
                    next: (dataEquipos) => {
                      console.log('Equipos actualizados:', dataEquipos);
                    },
                    error: (errorEquipos) => {
                      console.error('Error al cargar equipos:', errorEquipos.message);                     
                      this.utilsService.closeLoading();
                    }
                  });
                },
                error: (errorGerencias) => {
                  console.error('Error al cargar gerencias:', errorGerencias.message);
                  Swal.fire('Error al cargar gerencias.', '', 'error');
                  this.utilsService.closeLoading();
                }
              });
                /*FIN PROY-0013*/
                Swal.fire("Calendario registrado","El calendario fue registrado con éxito.","success").then(() => {
                  return this.router.navigateByUrl('/home/gestion-calendario');
                })
              },
              error: (error) => {
                console.error("Error:", error.message);
                Swal.fire("Error al registrar calendario",error.error.mensaje,"error");
              }
            }); 
        }
      })  
    } else {
      Swal.fire("ALERTA","Por favor, completa todos los campos para continuar.",'warning')
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