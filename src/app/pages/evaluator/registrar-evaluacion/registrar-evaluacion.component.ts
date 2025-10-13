import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-registrar-evaluacion',
  templateUrl: './registrar-evaluacion.component.html',
  styleUrls: ['./registrar-evaluacion.component.css']
})
export class RegistrarEvaluacionComponent implements OnInit, OnDestroy {
  DataList: IEvaluateWorkersReport[]
  CalendarCode = "";
  CalendarType: string = this.route.snapshot.paramMap.get('CalendarType');
  ShowTable: boolean = false;
  SesionData = this.loginService.GetUserSession();
  private routeSub: Subscription;

  constructor(
    private peopletobeevaluatedService: PeopletobeevaluatedService,
    private calendarService: CalendarService,
    private utilsService: UtilsService,
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) {}

ngOnInit(): void {
  this.routeSub = this.route.paramMap.subscribe(params => {
    this.CalendarType = params.get('CalendarType');
    this.LoadData();
  });
}
  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  FormatDate(date: string): any{
    return this.utilsService.GetFormatedDate(date)
  }
  
  async LoadData(): Promise<any> {
    this.utilsService.showLoading();
    const data = await this.calendarService.getDataScheduleApi().toPromise();

    if (this.CalendarType === undefined) {
      return this.router.navigateByUrl('/home');
    }

     //const FilterResult = data.registros.filter((data: { tipo: string; }) => data.tipo === this.CalendarType);

    const FilterResult = data.registros.filter((item: any) => String(item.tipo) === String(this.CalendarType));
    this.CalendarCode = FilterResult[0].vCodigo;

    if (FilterResult.length > 0) {
      this.CalendarCode = FilterResult[0].vCodigo;
      } else {
        console.warn("No se encontró ningún registro con tipo:", this.CalendarType);
        this.utilsService.closeLoading();
        return;
      }

    const workerData = await this.peopletobeevaluatedService.GetWorkersList(this.SesionData.codPuesto, this.CalendarCode).toPromise();
    ////console.log(workerData)
    if(workerData.registros.length === 0){
      Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info").then(() => {
        return this.router.navigateByUrl('/home');
      })

    }else{
      this.DataList = [...workerData.registros].sort((a, b) => {
        if (a.estadoEvaluacion === false && b.estadoEvaluacion !== false) {
          return -1;
        }
      });
      this.ShowTable = true;
      this.utilsService.closeLoading();;
    }
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  goPrintFormat(codFicha:string ,codPuesto: string,EvaluadorCodFicha: string, EvaluadorCodPuesto: string, CodCalendario: string){
    const newWindow = window.open(`#/home/formato-imp-evaluacion/${codFicha}/${codPuesto}/${EvaluadorCodFicha}/${EvaluadorCodPuesto}/${CodCalendario}`, '_blank');

    if (newWindow) {
        newWindow.onafterprint = () => {
          newWindow.close();
        };
    }
  }

  DownloadMasive():void {
    window.open(`#/home/descarga-masiva/${this.SesionData.codPuesto}/${this.SesionData.ficha}/${this.CalendarType}`,'_blank');
  }

  ViewEndedEvaluations():void{
    window.open(`#/home/evaluaciones-finalizadas/${this.SesionData.ficha}/${this.SesionData.codPuesto}/${this.CalendarCode}/${this.CalendarType}`,'_blank');
  }

}