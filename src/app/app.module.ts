import { BrowserModule, HAMMER_GESTURE_CONFIG  } from '@angular/platform-browser';
import { GestureConfig } from '@angular/material';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule, DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';

import { StepsModule } from 'primeng/steps';
import { HomeComponent } from './pages/home/home.component';;
import { GerencyteamsmultiselectComponent } from './shared/components/utils/gerencyteamsmultiselect/gerencyteamsmultiselect.component';
import { QuestionstableComponent } from './shared/components/questionstable/questionstable.component';
import { FaseConocimientoComponent } from './pages/worker/fase-conocimiento/fase-conocimiento.component';
import { FaseEvaluacionComponent } from './pages/worker/fase-evaluacion/fase-evaluacion.component';
import { ActualizarGrupoevalComponent } from './pages/admin/actualizar-grupoeval/actualizar-grupoeval.component';
import { ReporteConocimientoComponent } from './pages/admin/reporte-conocimiento/reporte-conocimiento.component';
import { UpdateevaluationgroupmodalComponent } from './shared/components/modalmanagement/modals/updateevaluationgroupmodal/updateevaluationgroupmodal.component';
import { QuestionstablewithanswersComponent } from './shared/components/questionstable/questionstablewithanswers/questionstablewithanswers.component';
import { TitleComponent } from './shared/components/title/title.component';
import { ResultsComponent } from './shared/components/questionstable/questionstablewithanswers/results/results.component';
import { ReporteAutoevaluacionComponent } from './pages/admin/reporte-autoevaluacion/reporte-autoevaluacion.component';
import { TokenInterceptor } from './core/Interceptors/TokenInterceptor';
import { FilepositionperiodfilterComponent } from './shared/components/utils/filepositionperiodfilter/filepositionperiodfilter.component';
import { RegistrarEvaluacionComponent } from './pages/evaluator/registrar-evaluacion/registrar-evaluacion.component';
import { ReporteAvanceevaluacionComponent } from './pages/admin/reporte-avanceevaluacion/reporte-avanceevaluacion.component';
import { EvaluationResultiframeComponent } from './shared/components/utils/evaluationresultiframe/evaluationresultiframe.component';
import { AddoutstandingfactmodalComponent } from './shared/components/modalmanagement/modals/addoutstandingfactmodal/addoutstandingfactmodal.component';
import { EvalconsolidatedreportmodalComponent } from './shared/components/modalmanagement/modals/evalconsolidatedreportmodal/evalconsolidatedreportmodal.component';
import { ImprimirFormatopreevalComponent } from './pages/worker/imprimir-formatopreeval/imprimir-formatopreeval.component';
import { HechoResaltanteComponent } from './pages/admin/hecho-resaltante/hecho-resaltante.component';
import { DetallesEvaluadorComponent } from './pages/admin/detalles-evaluador/detalles-evaluador.component';
import { ViewworkerprogressionComponent } from './pages/evaluator/viewworkerprogression/viewworkerprogression.component';
import { ViewselectedworkerresultComponent } from './pages/admin/viewselectedworkerresult/viewselectedworkerresult.component';
import { AutorizatecalibrationmodalComponent } from './shared/components/modalmanagement/modals/autorizatecalibrationmodal/autorizatecalibrationmodal.component';
import { ReporteCalibracionComponent } from './pages/admin/reporte-calibracion/reporte-calibracion.component';
import { AdminReporteRetroalimentacionComponent } from './pages/admin/admin-reporte-retroalimentacion/admin-reporte-retroalimentacion.component';
import { ChangefeedbackperiodComponent } from './shared/components/modalmanagement/modals/changefeedbackperiod/changefeedbackperiod.component';
import { ReporteRetroalimentacionporevaluadorDetalleComponent } from './pages/admin/admin-reporte-retroalimentacion/reporte-retroalimentacionporevaluador-detalle/reporte-retroalimentacionporevaluador-detalle.component';import { ChartsModule } from 'ng2-charts';
import { RegistroPidOriginalComponent } from './pages/worker/registro-pid-original/registro-pid-original.component';
import { RegistroCumplimientoPidComponent } from './pages/worker/registro-cumplimiento-pid/registro-cumplimiento-pid.component';
import { ReportePidComponent } from './pages/admin/reporte-pid/reporte-pid.component';
import { MaintenanceofdeliverablesComponent } from './shared/components/utils/maintenanceofdeliverables/maintenanceofdeliverables.component';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { PickListModule } from 'primeng/picklist';
import { MessagesModule } from 'primeng/messages';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon'
import { OnlyNumberDirective } from './core/directives/only-number.directive';
import { MatSelectModule } from '@angular/material/select';
import { TargetscountersComponent } from './shared/components/utils/targetscounters/targetscounters.component';
import { PidMantenimientoEntregablesIndicadoresComponent } from './pages/admin/pid-mantenimiento-entregables-indicadores/pid-mantenimiento-entregables-indicadores.component';
import { MinDateTodayDirective } from './core/directives/min-date-today-directive.directive';
import { DetalleevaluadorComponent } from './pages/admin/reporte-pid/detalleevaluador/detalleevaluador.component';
import { ExpirationTokenInterceptorDirective } from './core/directives/expiration-token-interceptor.directive';
import { VisualizarRetroalimentacionComponent } from './pages/admin/admin-reporte-retroalimentacion/visualizar-retroalimentacion/visualizar-retroalimentacion.component';
import { NumberRangeValidatorDirective } from './core/directives/number-range-validator-directive.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToolbarComponent } from './shared/navegation/toolbar/toolbar.component';
import { SlidedrawerComponent } from './shared/navegation/slidedrawer/slidedrawer.component';
import { RegisteradministratormodalComponent } from './shared/components/modalmanagement/modals/registeradministratormodal/registeradministratormodal.component';
import { InputSwitchModule } from 'primeng/inputswitch';
import { RegistroCalendarioComponent } from './pages/admin/registro-calendario/registro-calendario.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { RegistroReglasCalculoComponent } from './pages/admin/registro-reglas-calculo/registro-reglas-calculo.component';
import {  MatRadioModule  } from '@angular/material/radio';
import { MatSliderModule } from '@angular/material/slider';
import { MatStepperModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import  {MatTableModule } from '@angular/material/table';
import { ModalmanagementComponent } from './shared/components/modalmanagement/modalmanagement.component';
import { MatDialogModule } from '@angular/material/dialog';
import { RegistroGruposEvaluacionComponent } from './pages/admin/registro-grupos-evaluacion/registro-grupos-evaluacion.component';
import { AsignacionGruposEvaluacionComponent } from './pages/admin/asignacion-grupos-evaluacion/asignacion-grupos-evaluacion.component';
import { RegistroEvaluadores90Component } from './pages/admin/registro-evaluadores90/registro-evaluadores90.component';
import { RegistroEvaluadores180Component } from './pages/admin/registro-evaluadores180/registro-evaluadores180.component';
import { RegisterexceptionComponent } from './shared/components/modalmanagement/modals/registerexception/registerexception.component';
import { ChangeexceptionlimitdatesComponent } from './shared/components/modalmanagement/modals/changeexceptionlimitdates/changeexceptionlimitdates.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GestionCalendariosComponent } from './pages/admin/gestion-calendarios/gestion-calendarios.component';
import { RegistroCatalogoCompetenciasComponent } from './pages/admin/registro-catalogo-competencias/registro-catalogo-competencias.component';
import { RegistroAdministradoresComponent } from './pages/admin/registro-administradores/registro-administradores.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ReporteExcepcionComponent } from './pages/admin/reporte-excepcion/reporte-excepcion.component';
import { HistoricoEvaluacionComponent } from './pages/admin/reportes-historicos/historico-evaluacion/historico-evaluacion.component';
import { HistoricoHechosResaltantesComponent } from './pages/admin/reportes-historicos/historico-hechos-resaltantes/historico-hechos-resaltantes.component';
import { HistoricoCalibracionComponent } from './pages/admin/reportes-historicos/historico-calibracion/historico-calibracion.component';
import { HistoricoEvaluacionDetalleEvaluadorComponent } from './pages/admin/reportes-historicos/historico-evaluacion/historico-evaluacion-detalle-evaluador/historico-evaluacion-detalle-evaluador.component';
import { HistoricoHechosResaltantesDetalleEvaluadorComponent } from './pages/admin/reportes-historicos/historico-hechos-resaltantes/historico-hechos-resaltantes-detalle-evaluador/historico-hechos-resaltantes-detalle-evaluador.component';
import { FeedbackmodalComponent } from './shared/components/modalmanagement/modals/feedbackmodal/feedbackmodal.component';
import { EvaluatorFeedbackReportComponent } from './pages/evaluator/evaluator-feedback-report/evaluator-feedback-report.component';
import { RegisterEvaluatedFeedbackComponent } from './pages/evaluator/evaluator-feedback-report/register-evaluated-feedback/register-evaluated-feedback.component';
import { PidEvaluatorcompliancetableComponent } from './pages/evaluator/pid-evaluatorcompliancetable/pid-evaluatorcompliancetable.component';
import { PidWatchevaluatedcompliancepidComponent } from './pages/evaluator/pid-evaluatorcompliancetable/pid-watchevaluatedcompliancepid/pid-watchevaluatedcompliancepid.component';
import { PidEvaluatortableComponent } from './pages/evaluator/pid-evaluatortable/pid-evaluatortable.component';
import { PidWatchevaluatedpidComponent } from './pages/evaluator/pid-evaluatortable/pid-watchevaluatedpid/pid-watchevaluatedpid.component';
import { EvaluateworkerComponent } from './pages/evaluator/registerevaluation/evaluateworker/evaluateworker.component';
import { MasiveformatComponent } from './pages/evaluator/registerevaluation/masiveformat/masiveformat.component';
import { PrintformatComponent } from './pages/evaluator/registerevaluation/printformat/printformat.component';
import { WorkerresultComponent } from './pages/evaluator/registerevaluation/workerresult/workerresult.component';
import { RegistroRetroalimentacionComponent } from './pages/worker/registro-retroalimentacion/registro-retroalimentacion.component';
import { ExcepcionEvaluacionDetalleComponent } from './pages/admin/reporte-excepcion/excepcion-evaluacion-detalle/excepcion-evaluacion-detalle.component';
import { VerExcepcionResultadoEvaluacionComponent } from './pages/admin/reporte-excepcion/excepcion-evaluacion-detalle/ver-excepcion-resultado-evaluacion/ver-excepcion-resultado-evaluacion.component';
import { ExcepcionRetroalimentacionDetalleComponent } from './pages/admin/reporte-excepcion/excepcion-retroalimentacion-detalle/excepcion-retroalimentacion-detalle.component';
import { VerExcepcionResultadoRetroalimentacionComponent } from './pages/admin/reporte-excepcion/excepcion-retroalimentacion-detalle/ver-excepcion-resultado-retroalimentacion/ver-excepcion-resultado-retroalimentacion.component';
import { ComparativecalibrationsmodalComponent } from './shared/components/modalmanagement/modals/comparativecalibrationsmodal/comparativecalibrationsmodal.component';
import { ParametrizarCalendarioComponent } from './pages/admin/parametrizar-calendario/parametrizar-calendario.component';
import { EditarCalendarioComponent } from './pages/admin/editar-calendario/editar-calendario.component';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { CustomPaginatorIntl } from './core/paginationstranslationtexts/CustomPaginatorIntl';
import { ExcepcionPidCumplimientoDetalleComponent } from './pages/admin/reporte-excepcion/excepcion-pid-cumplimiento-detalle/excepcion-pid-cumplimiento-detalle.component';
import { MatListModule } from '@angular/material/list';
import { RegistroGruposEvaluacionDetalleComponent } from './pages/admin/registro-grupos-evaluacion-detalle/registro-grupos-evaluacion-detalle.component';
import { VerEvaluacionesFinalizadasComponent } from './pages/evaluator/ver-evaluaciones-finalizadas/ver-evaluaciones-finalizadas.component';
import { VerPidSimpleComponent } from './pages/admin/reporte-pid/detalleevaluador/ver-pid-simple/ver-pid-simple/ver-pid-simple.component';
import { VerPidCumplimientoComponent } from './pages/admin/reporte-pid/detalleevaluador/ver-pid-simple/ver-pid-cumplimiento/ver-pid-cumplimiento.component';
import { PIDComponent } from './pages/admin/reporte-excepcion/excepcion-pid-cumplimiento-detalle/ver-excepcion-pid-cumplimiento/PID/pid/pid.component';
import { CUMPLIMIENTOComponent } from './pages/admin/reporte-excepcion/excepcion-pid-cumplimiento-detalle/ver-excepcion-pid-cumplimiento/CUMPLIMIENTO/cumplimiento/cumplimiento.component';
import { ResultadoTrabajadorHistoricoComponent } from './pages/admin/reportes-historicos/historico-evaluacion/historico-evaluacion-detalle-evaluador/resultado-trabajador-historico/resultado-trabajador-historico/resultado-trabajador-historico.component';

import { SincronizacionUnidadOrganizativaComponent } from './pages/admin/sincronizacion-unidad-organizativa/sincronizacion-unidad-organizativa.component';
import { AsignacionGruposCargaAutomaticavalComponent } from './pages/admin/carga-automatica-asignacion/asignacion-grupos-carga-automatica.component';
import {RegistroEvaluadoEvaluadorCargaAutomaticavalComponent} from './pages/admin/carga-automatica-registro/registro-evaluado-evaluador-carga-automatica.component';

import { MatSortModule } from '@angular/material/sort';
import { CardModule } from 'primeng/card';
import { VisualizarGlobalComponent } from './pages/admin/visualizar-retroalimentacion-global/visualizar-global.component';
import { ItemGlobalComponent } from './pages/admin/visualizar-retroalimentacion-global/item-global/item-global.component';
// Formato personalizado para el mat-datepicker
export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    GerencyteamsmultiselectComponent,
    QuestionstableComponent,
    FaseConocimientoComponent,
    FaseEvaluacionComponent,
    ReporteConocimientoComponent,
    ActualizarGrupoevalComponent,
    AsignacionGruposCargaAutomaticavalComponent,
    RegistroEvaluadoEvaluadorCargaAutomaticavalComponent,
    UpdateevaluationgroupmodalComponent,
    QuestionstablewithanswersComponent,
    TitleComponent,
    ResultsComponent,
    ReporteAutoevaluacionComponent,
    FilepositionperiodfilterComponent,
    RegistrarEvaluacionComponent,
    ReporteAvanceevaluacionComponent,
    EvaluationResultiframeComponent,
    DetallesEvaluadorComponent,
    AddoutstandingfactmodalComponent,
    EvalconsolidatedreportmodalComponent,
    PrintformatComponent,
    ImprimirFormatopreevalComponent,
    HechoResaltanteComponent,
    EvaluateworkerComponent,
    WorkerresultComponent,
    ViewworkerprogressionComponent,
    ViewselectedworkerresultComponent,
    MasiveformatComponent,
    AutorizatecalibrationmodalComponent,
    ReporteCalibracionComponent,
    AdminReporteRetroalimentacionComponent,
    ChangefeedbackperiodComponent,
    ReporteRetroalimentacionporevaluadorDetalleComponent,
    RegistroPidOriginalComponent,
    PidEvaluatortableComponent,
    PidWatchevaluatedpidComponent,
    RegistroCumplimientoPidComponent,
    ReportePidComponent,
    MaintenanceofdeliverablesComponent,
    OnlyNumberDirective,
    EvaluatorFeedbackReportComponent,
    TargetscountersComponent,
    PidMantenimientoEntregablesIndicadoresComponent,
    SincronizacionUnidadOrganizativaComponent,
    PidWatchevaluatedcompliancepidComponent,
    MinDateTodayDirective,
    DetalleevaluadorComponent,
    ExpirationTokenInterceptorDirective,
    RegisterEvaluatedFeedbackComponent,
    VisualizarRetroalimentacionComponent,
    NumberRangeValidatorDirective,
    PidEvaluatorcompliancetableComponent,
    ToolbarComponent,
    SlidedrawerComponent,
    RegisteradministratormodalComponent,
    RegistroCalendarioComponent,
    RegistroReglasCalculoComponent,
    ModalmanagementComponent,
    RegistroGruposEvaluacionComponent,
    AsignacionGruposEvaluacionComponent,
    RegistroEvaluadores90Component,
    RegistroEvaluadores180Component,
    RegisterexceptionComponent,
    ChangeexceptionlimitdatesComponent,
    GestionCalendariosComponent,
    RegistroCatalogoCompetenciasComponent,
    RegistroAdministradoresComponent,
    ReporteExcepcionComponent,
    HistoricoEvaluacionComponent,
    HistoricoHechosResaltantesComponent,
    HistoricoCalibracionComponent,
    HistoricoEvaluacionDetalleEvaluadorComponent,
    HistoricoHechosResaltantesDetalleEvaluadorComponent,
    FeedbackmodalComponent,
    RegistroRetroalimentacionComponent,
    ExcepcionEvaluacionDetalleComponent,
    VerExcepcionResultadoEvaluacionComponent,
    ExcepcionRetroalimentacionDetalleComponent,
    VerExcepcionResultadoRetroalimentacionComponent,
    ComparativecalibrationsmodalComponent,
    ParametrizarCalendarioComponent,
    EditarCalendarioComponent,
    ExcepcionPidCumplimientoDetalleComponent,
    RegistroGruposEvaluacionDetalleComponent,
    VerEvaluacionesFinalizadasComponent,
    VerPidSimpleComponent,
    VerPidCumplimientoComponent,
    PIDComponent,
    CUMPLIMIENTOComponent,
    ResultadoTrabajadorHistoricoComponent,
    VisualizarGlobalComponent,
    ItemGlobalComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    ButtonModule,
    BrowserModule,
    CalendarModule,
    DialogModule,
    DropdownModule,
    PickListModule,
    ChartsModule,
    MessagesModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatTooltipModule,
    InputSwitchModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSliderModule,
    MatStepperModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    StepsModule,
    MatPaginatorModule,
    MatListModule,
    MatSortModule,
    CardModule
  ],  
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy, 
      useClass: HashLocationStrategy
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ExpirationTokenInterceptorDirective,
      multi: true
    }, 
    {
      provide: MAT_DATE_FORMATS, 
      useValue: MY_DATE_FORMATS 
    },
    { 
      provide: MAT_DATE_LOCALE, 
      useValue: 'es-ES' 
    },
    { 
      provide: HAMMER_GESTURE_CONFIG, 
      useClass: GestureConfig 
    },
    {
      provide: DatePipe,
      useClass: DatePipe
    },
    { provide: MatPaginatorIntl, 
      useClass: CustomPaginatorIntl 
    },
  FormBuilder,RouterModule,HttpClient, RouterModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
