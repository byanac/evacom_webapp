import { NgModule } from '@angular/core';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule, Routes } from '@angular/router';
import { SessionGuard } from './core/guards/session.guard';
import { AdminGuard } from './core/guards/admin.guard';
import { EvaluationResultiframeComponent } from './shared/components/utils/evaluationresultiframe/evaluationresultiframe.component';
import { EvaluatedRoutes } from './core/routes/EvaluatedRoutes';
import { EvaluatorRoutes } from './core/routes/EvaluatorRoutes';
import { AdminRoutes } from './core/routes/AdminRoutes';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full'},
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent,
    children: [
      ...EvaluatedRoutes,
      ...EvaluatorRoutes,
      ...AdminRoutes
    ],
  },
  { 
    path: 'Iframe/:EvaluatedFile/:EvaluatedPosition', 
    component: EvaluationResultiframeComponent, 
    canActivate: [SessionGuard,AdminGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ]
})
export class AppRoutingModule { }
