import { HechoResaltanteComponent } from "src/app/pages/admin/hecho-resaltante/hecho-resaltante.component";
import { RegistrarEvaluacionComponent } from "src/app/pages/evaluator/registrar-evaluacion/registrar-evaluacion.component";
import { ViewworkerprogressionComponent } from "src/app/pages/evaluator/viewworkerprogression/viewworkerprogression.component";
import { EvaluatorGuard } from "../guards/evaluator.guard";
import { SessionGuard } from "../guards/session.guard";
import { ChiefEvaluatorGuard } from "../guards/chief-evaluator.guard";
import { EvaluatorFeedbackReportComponent } from "src/app/pages/evaluator/evaluator-feedback-report/evaluator-feedback-report.component";
import { RegisterEvaluatedFeedbackComponent } from "src/app/pages/evaluator/evaluator-feedback-report/register-evaluated-feedback/register-evaluated-feedback.component";
import { PidEvaluatorcompliancetableComponent } from "src/app/pages/evaluator/pid-evaluatorcompliancetable/pid-evaluatorcompliancetable.component";
import { PidWatchevaluatedcompliancepidComponent } from "src/app/pages/evaluator/pid-evaluatorcompliancetable/pid-watchevaluatedcompliancepid/pid-watchevaluatedcompliancepid.component";
import { PidEvaluatortableComponent } from "src/app/pages/evaluator/pid-evaluatortable/pid-evaluatortable.component";
import { PidWatchevaluatedpidComponent } from "src/app/pages/evaluator/pid-evaluatortable/pid-watchevaluatedpid/pid-watchevaluatedpid.component";
import { MasiveformatComponent } from "src/app/pages/evaluator/registerevaluation/masiveformat/masiveformat.component";
import { PrintformatComponent } from "src/app/pages/evaluator/registerevaluation/printformat/printformat.component";
import { VerEvaluacionesFinalizadasComponent } from "src/app/pages/evaluator/ver-evaluaciones-finalizadas/ver-evaluaciones-finalizadas.component";
import { RegistroEvaluadoEvaluadorCargaAutomaticavalComponent } from "src/app/pages/admin/carga-automatica-registro/registro-evaluado-evaluador-carga-automatica.component";

export const EvaluatorRoutes = [
    {
      path: 'registrar-evaluacion/:CalendarType',
      component: RegistrarEvaluacionComponent,
      canActivate: [SessionGuard,EvaluatorGuard]
    },
    {
      path: 'formato-imp-evaluacion/:TcodFichaFetch/:TcodPuestoToFetch/:EcodFichaFetch/:EcodPuestoFetch/:CalendarCode',
      component: PrintformatComponent,
      canActivate: [SessionGuard,EvaluatorGuard]
    },
    {
      path: 'evaluaciones-finalizadas/:EvaluatorFileCode/:EvaluatorPositionCode/:CalendarCode/:CalendarType',
      component: VerEvaluacionesFinalizadasComponent,
      canActivate: [SessionGuard,EvaluatorGuard]
    },
    {
      path: 'añadir-hecho-resaltante',
      component: HechoResaltanteComponent,
      canActivate: [SessionGuard,EvaluatorGuard, ChiefEvaluatorGuard]
    },
    {
      path: 'progreso-trabajador/:TcodFichaFetch/:TcodPuestoToFetch/:EcodFichaFetch/:EcodPuestoFetch/:CalendarCode/:CalendarType',
      component: ViewworkerprogressionComponent,
      canActivate: [SessionGuard,EvaluatorGuard]
    },
    {
      path: 'descarga-masiva/:ECodPuesto/:ECodFicha/:CalendarType',
      component: MasiveformatComponent,
      canActivate: [SessionGuard,EvaluatorGuard]
    },
    {
      path: 'evaluador-reporte-retroalimentacion',
      component: EvaluatorFeedbackReportComponent,
      canActivate: [SessionGuard,EvaluatorGuard,ChiefEvaluatorGuard]
    }, 
    {
      path: 'evaluador-validacion-pid',
      component: PidEvaluatortableComponent,
      canActivate: [SessionGuard, ChiefEvaluatorGuard]
    },
    {
      path: 'ver-pid-evaluado/:Type/:CodigoPuestoEvaluado/:CodCalendario/:CodFicha',
      component: PidWatchevaluatedpidComponent,
      canActivate: [SessionGuard, ChiefEvaluatorGuard]
    },
    {
      path: 'evaluador-seguimiento-pid',
      component: PidEvaluatorcompliancetableComponent,
      canActivate: [SessionGuard, ChiefEvaluatorGuard]
    },
    {
      path: 'ver-cumplimiento-pid-evaluado/:Type/:CodigoPuestoEvaluado/:CodCalendario/:CodFicha',
      component: PidWatchevaluatedcompliancepidComponent,
      canActivate: [SessionGuard, ChiefEvaluatorGuard]
    },
    {
      path: 'evaluador-registro-retroalimentacion/:EvaluadoCodigoFicha/:EvaluadoCodigoPuesto/:CodCalendario/:RetroalimentacionID',
      component: RegisterEvaluatedFeedbackComponent,
      canActivate: [SessionGuard, ChiefEvaluatorGuard]
    },
    { 
  path: 'registro-evaluado-evaluador-carga-automatica/:CalendarID', 
  component: RegistroEvaluadoEvaluadorCargaAutomaticavalComponent 
}

  ]