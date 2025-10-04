import { FaseConocimientoComponent } from "src/app/pages/worker/fase-conocimiento/fase-conocimiento.component";
import { FaseEvaluacionComponent } from "src/app/pages/worker/fase-evaluacion/fase-evaluacion.component";
import { EvaluatedGuard } from "../guards/evaluated.guard";
import { SessionGuard } from "../guards/session.guard";
import { RegistroPidOriginalComponent } from "src/app/pages/worker/registro-pid-original/registro-pid-original.component";
import { RegistroCumplimientoPidComponent } from "src/app/pages/worker/registro-cumplimiento-pid/registro-cumplimiento-pid.component";
import { RegistroRetroalimentacionComponent } from "src/app/pages/worker/registro-retroalimentacion/registro-retroalimentacion.component";
import { EvaluatedpidaccessGuard } from "../guards/evaluatedpidaccess.guard";

export const EvaluatedRoutes = [
    {
      path: 'fase-conocimiento', 
      component: FaseConocimientoComponent,
      canActivate: [SessionGuard,EvaluatedGuard]
    },
    {
      path: 'fase-autoevaluacion',
      component: FaseEvaluacionComponent, 
      canActivate: [SessionGuard,EvaluatedGuard]
    },
    {
      path: 'registro-pid',
      component: RegistroPidOriginalComponent,
      canActivate: [SessionGuard,EvaluatedGuard, EvaluatedpidaccessGuard]
    },
    {
      path: 'registro-cumplimiento-pid',
      component: RegistroCumplimientoPidComponent,
      canActivate: [SessionGuard,EvaluatedGuard, EvaluatedpidaccessGuard]
    },
    {
      path: 'registro-retroalimentacion',
      component: RegistroRetroalimentacionComponent,
      canActivate: [SessionGuard]
    }, 
  ]