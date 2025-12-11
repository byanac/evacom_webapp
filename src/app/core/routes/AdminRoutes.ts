import { ActualizarGrupoevalComponent } from "src/app/pages/admin/actualizar-grupoeval/actualizar-grupoeval.component";
import { AdminReporteRetroalimentacionComponent } from "src/app/pages/admin/admin-reporte-retroalimentacion/admin-reporte-retroalimentacion.component";
import { DetallesEvaluadorComponent } from "src/app/pages/admin/detalles-evaluador/detalles-evaluador.component";
import { ReporteAutoevaluacionComponent } from "src/app/pages/admin/reporte-autoevaluacion/reporte-autoevaluacion.component";
import { ReporteAvanceevaluacionComponent } from "src/app/pages/admin/reporte-avanceevaluacion/reporte-avanceevaluacion.component";
import { ReporteCalibracionComponent } from "src/app/pages/admin/reporte-calibracion/reporte-calibracion.component";
import { ReporteConocimientoComponent } from "src/app/pages/admin/reporte-conocimiento/reporte-conocimiento.component";
import { ReportePidComponent } from "src/app/pages/admin/reporte-pid/reporte-pid.component";
import { ReporteRetroalimentacionporevaluadorDetalleComponent } from "src/app/pages/admin/admin-reporte-retroalimentacion/reporte-retroalimentacionporevaluador-detalle/reporte-retroalimentacionporevaluador-detalle.component";
import { ViewselectedworkerresultComponent } from "src/app/pages/admin/viewselectedworkerresult/viewselectedworkerresult.component";
import { ResultsComponent } from "src/app/shared/components/questionstable/questionstablewithanswers/results/results.component";
import { AdminGuard } from "../guards/admin.guard";
import { SessionGuard } from "../guards/session.guard";
import { PidMantenimientoEntregablesIndicadoresComponent } from "src/app/pages/admin/pid-mantenimiento-entregables-indicadores/pid-mantenimiento-entregables-indicadores.component";
import { DetalleevaluadorComponent } from "src/app/pages/admin/reporte-pid/detalleevaluador/detalleevaluador.component";
import { VisualizarRetroalimentacionComponent } from "src/app/pages/admin/admin-reporte-retroalimentacion/visualizar-retroalimentacion/visualizar-retroalimentacion.component";
import { RegistroCalendarioComponent } from "src/app/pages/admin/registro-calendario/registro-calendario.component";
import { RegistroReglasCalculoComponent } from "src/app/pages/admin/registro-reglas-calculo/registro-reglas-calculo.component";
import { RegistroGruposEvaluacionComponent } from "src/app/pages/admin/registro-grupos-evaluacion/registro-grupos-evaluacion.component";
import { AsignacionGruposEvaluacionComponent } from "src/app/pages/admin/asignacion-grupos-evaluacion/asignacion-grupos-evaluacion.component";
import { RegistroEvaluadores90Component } from "src/app/pages/admin/registro-evaluadores90/registro-evaluadores90.component";
import { RegistroEvaluadores180Component } from "src/app/pages/admin/registro-evaluadores180/registro-evaluadores180.component";
import { GestionCalendariosComponent } from "src/app/pages/admin/gestion-calendarios/gestion-calendarios.component";
import { RegistroCatalogoCompetenciasComponent } from "src/app/pages/admin/registro-catalogo-competencias/registro-catalogo-competencias.component";
import { RegistroAdministradoresComponent } from "src/app/pages/admin/registro-administradores/registro-administradores.component";
import { ReporteExcepcionComponent } from "src/app/pages/admin/reporte-excepcion/reporte-excepcion.component";
import { HistoricoEvaluacionComponent } from "src/app/pages/admin/reportes-historicos/historico-evaluacion/historico-evaluacion.component";
import { HistoricoHechosResaltantesComponent } from "src/app/pages/admin/reportes-historicos/historico-hechos-resaltantes/historico-hechos-resaltantes.component";
import { HistoricoCalibracionComponent } from "src/app/pages/admin/reportes-historicos/historico-calibracion/historico-calibracion.component";
import { HistoricoEvaluacionDetalleEvaluadorComponent } from "src/app/pages/admin/reportes-historicos/historico-evaluacion/historico-evaluacion-detalle-evaluador/historico-evaluacion-detalle-evaluador.component";
import { HistoricoHechosResaltantesDetalleEvaluadorComponent } from "src/app/pages/admin/reportes-historicos/historico-hechos-resaltantes/historico-hechos-resaltantes-detalle-evaluador/historico-hechos-resaltantes-detalle-evaluador.component";
import { EvaluateworkerComponent } from "src/app/pages/evaluator/registerevaluation/evaluateworker/evaluateworker.component";
import { ExcepcionEvaluacionDetalleComponent } from "src/app/pages/admin/reporte-excepcion/excepcion-evaluacion-detalle/excepcion-evaluacion-detalle.component";
import { VerExcepcionResultadoEvaluacionComponent } from "src/app/pages/admin/reporte-excepcion/excepcion-evaluacion-detalle/ver-excepcion-resultado-evaluacion/ver-excepcion-resultado-evaluacion.component";
import { ExcepcionRetroalimentacionDetalleComponent } from "src/app/pages/admin/reporte-excepcion/excepcion-retroalimentacion-detalle/excepcion-retroalimentacion-detalle.component";
import { VerExcepcionResultadoRetroalimentacionComponent } from "src/app/pages/admin/reporte-excepcion/excepcion-retroalimentacion-detalle/ver-excepcion-resultado-retroalimentacion/ver-excepcion-resultado-retroalimentacion.component";
import { ParametrizarCalendarioComponent } from "src/app/pages/admin/parametrizar-calendario/parametrizar-calendario.component";
import { EditarCalendarioComponent } from "src/app/pages/admin/editar-calendario/editar-calendario.component";
import { ExcepcionPidCumplimientoDetalleComponent } from "src/app/pages/admin/reporte-excepcion/excepcion-pid-cumplimiento-detalle/excepcion-pid-cumplimiento-detalle.component";
import { RegistroGruposEvaluacionDetalleComponent } from "src/app/pages/admin/registro-grupos-evaluacion-detalle/registro-grupos-evaluacion-detalle.component";
import { ViewworkerprogressionComponent } from "src/app/pages/evaluator/viewworkerprogression/viewworkerprogression.component";
import { VerPidSimpleComponent } from "src/app/pages/admin/reporte-pid/detalleevaluador/ver-pid-simple/ver-pid-simple/ver-pid-simple.component";
import { VerPidCumplimientoComponent } from "src/app/pages/admin/reporte-pid/detalleevaluador/ver-pid-simple/ver-pid-cumplimiento/ver-pid-cumplimiento.component";
import { CUMPLIMIENTOComponent } from "src/app/pages/admin/reporte-excepcion/excepcion-pid-cumplimiento-detalle/ver-excepcion-pid-cumplimiento/CUMPLIMIENTO/cumplimiento/cumplimiento.component";
import { PIDComponent } from "src/app/pages/admin/reporte-excepcion/excepcion-pid-cumplimiento-detalle/ver-excepcion-pid-cumplimiento/PID/pid/pid.component";
import { ResultadoTrabajadorHistoricoComponent } from "src/app/pages/admin/reportes-historicos/historico-evaluacion/historico-evaluacion-detalle-evaluador/resultado-trabajador-historico/resultado-trabajador-historico/resultado-trabajador-historico.component";

import { SincronizacionUnidadOrganizativaComponent } from "src/app/pages/admin/sincronizacion-unidad-organizativa/sincronizacion-unidad-organizativa.component";
import {AsignacionGruposCargaAutomaticavalComponent} from "src/app/pages/admin/carga-automatica-asignacion/asignacion-grupos-carga-automatica.component"
import {RegistroEvaluadoEvaluadorCargaAutomaticavalComponent} from "src/app/pages/admin/carga-automatica-registro/registro-evaluado-evaluador-carga-automatica.component" 
import { VisualizarGlobalComponent } from "src/app/pages/admin/visualizar-retroalimentacion-global/visualizar-global.component";

export const AdminRoutes = [
    {
      path: 'actualizar-grupo-evaluacion',
      component: ActualizarGrupoevalComponent, 
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'administrar-conocimientos',
      component: ReporteConocimientoComponent, 
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'fase-resultados',
      component: ResultsComponent, 
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'fase-resultadosautoevaluacion',
      component: ReporteAutoevaluacionComponent, 
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'reporte-avance-evaluacion',
      component: ReporteAvanceevaluacionComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'reporte-resultados-detalle/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: DetallesEvaluadorComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'reporte-retroalimentacionporevaluador-detalle/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: ReporteRetroalimentacionporevaluadorDetalleComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'evaluar-trabajador',
      component: EvaluateworkerComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    /*INI PROY-00013 RFC*/
    {
      path: 'asignacion-grupos-carga-automatica/:CalendarID',
      component: AsignacionGruposCargaAutomaticavalComponent, 
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'registro-evaluado-evaluador-carga-automatica',
      component: RegistroEvaluadoEvaluadorCargaAutomaticavalComponent, 
      canActivate: [SessionGuard,AdminGuard]
    },
    /*FIN PROY-00013 RFC*/
    {
      path: 'resultados-trabajador/:TcodFichaFetch/:TcodPuestoToFetch/:EcodFichaFetch/:EcodPuestoFetch/:CalendarCode',
      component: ViewworkerprogressionComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'reporte-calibracion',
      component: ReporteCalibracionComponent,
      canActivate: [SessionGuard,AdminGuard]
    }, 
    {
      path: 'admin-reporte-avance-retroalimentación',
      component: AdminReporteRetroalimentacionComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'ver-progreso-calibracion/:CodEvaluatorFile/:CodCalendar/:IdEvaluation',
      component: ViewselectedworkerresultComponent,
      canActivate: [SessionGuard,AdminGuard]
    },   
    {
      path: 'reporte-pid',
      component: ReportePidComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'pid-detalleevaluador/:ModalityText/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: DetalleevaluadorComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'ver-pid-evaluado-reporteavance/:Type/:CodigoPuestoEvaluado/:CodCalendario/:CodFicha',
      component: VerPidSimpleComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'ver-cumplimiento-pid-evaluado-reporteavance/:Type/:CodigoPuestoEvaluado/:CodCalendario/:CodFicha',
      component: VerPidCumplimientoComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'mantenimiento-pid',
      component: PidMantenimientoEntregablesIndicadoresComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'admin-visualizar-retroalimentacion/:EvaluadoCodigoFicha/:EvaluadoCodigoPuesto/:EvaluadorCodigoFicha/:EvaluadorCodigoPuesto/:CodCalendario/:NombreCalendario/:RetroalimentacionID',
      component: VisualizarRetroalimentacionComponent,
      canActivate: [SessionGuard, AdminGuard]
    }, 
    {
      path: 'registro-administradores',
      component: RegistroAdministradoresComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'registro-calendario',
      component: RegistroCalendarioComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'editar-calendario/:CalendarID',
      component: EditarCalendarioComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'parametrizar-calendario/:CalendarID',
      component: ParametrizarCalendarioComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'configuracion-reglas-calculo/:CalendarID',
      component: RegistroReglasCalculoComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'registro-catalogo-comportamientos',
      component: RegistroCatalogoCompetenciasComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'registro-grupos-evaluacion',
      component: RegistroGruposEvaluacionComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'registro-detalle-grupos-evaluacion',
      component: RegistroGruposEvaluacionDetalleComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'asignacion-grupos-evaluacion/:CalendarID',
      component: AsignacionGruposEvaluacionComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'registro-evaluadores90/:CalendarID',
      component: RegistroEvaluadores90Component,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'registro-evaluadores180/:CalendarID',
      component: RegistroEvaluadores180Component,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'reporte-excepcion',
      component: ReporteExcepcionComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'reporte-excepcion-evaluacion-detalle/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: ExcepcionEvaluacionDetalleComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'reporte-excepcion-evaluacion-visualizar-evaluacion/:CodWorkerFile/:CodWorkerPosition/:CodEvaluatorFile/:CodEvaluatorPosition/:CodCalendar',
      component: VerExcepcionResultadoEvaluacionComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'reporte-excepcion-retroalimentacion-detalle/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: ExcepcionRetroalimentacionDetalleComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'reporte-excepcion-retroalimentacion-visualizar-retroalimentacion/:EvaluadoCodigoFicha/:EvaluadoCodigoPuesto/:EvaluadorCodigoFicha/:EvaluadorCodigoPuesto/:CodCalendario/:NombreCalendario/:RetroalimentacionID',
      component: VerExcepcionResultadoRetroalimentacionComponent,
      canActivate: [SessionGuard, AdminGuard]
    }, 
    {
      path: 'reporte-excepcion-pid-cumplimiento-detalleevaluador/:ModalityText/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: ExcepcionPidCumplimientoDetalleComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'ver-pid-evaluado-excepcion-reporteavance/:Type/:CodigoPuestoEvaluado/:CodCalendario/:CodFicha',
      component: PIDComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'ver-cumplimiento-pid-evaluado-excepcion-reporteavance/:Type/:CodigoPuestoEvaluado/:CodCalendario/:CodFicha',
      component: CUMPLIMIENTOComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'gestion-calendario',
      component: GestionCalendariosComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'historico-evaluaciones',
      component: HistoricoEvaluacionComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'historico-evaluaciones-reporte-resultados-detalle/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: HistoricoEvaluacionDetalleEvaluadorComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'resultado-trabajador-historico/:TcodFichaFetch/:TcodPuestoToFetch/:EcodFichaFetch/:EcodPuestoFetch/:CalendarCode',
      component: ResultadoTrabajadorHistoricoComponent,
      canActivate: [SessionGuard,AdminGuard]
    },
    {
      path: 'historico-hechos-resaltantes',
      component: HistoricoHechosResaltantesComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'historico-hechos-resaltantes-reporte-resultados-detalle/:EvaluatorName/:EvaluatorFile/:EvaluatorPosition/:CalendarCode',
      component: HistoricoHechosResaltantesDetalleEvaluadorComponent,
      canActivate: [SessionGuard, AdminGuard]
    },
    {
      path: 'historico-calibracion',
      component: HistoricoCalibracionComponent,
      canActivate: [SessionGuard, AdminGuard]
    }
    /*INI PROY-00013 RFC*/
    ,{
      path: 'sincronizacion-unidad-organizativa',
      component: SincronizacionUnidadOrganizativaComponent,
      canActivate: [SessionGuard, AdminGuard]
    }
    ,{
      path: 'reporte-retroalimentacion-global',
      component: VisualizarGlobalComponent,
      canActivate: [SessionGuard, AdminGuard]
    }
    /*FIN PROY-00013 RFC*/
  ]