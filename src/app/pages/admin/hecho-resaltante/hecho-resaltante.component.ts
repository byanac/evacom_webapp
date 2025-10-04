import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { AddoutstandingfactmodalService } from 'src/app/services/addoutstandingfactmodal/addoutstandingfactmodal.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hecho-resaltante',
  templateUrl: './hecho-resaltante.component.html',
  styleUrls: ['./hecho-resaltante.component.css']
})
export class HechoResaltanteComponent implements OnInit {
  ShowModal: boolean
  DataFromsessionStorage: any 
  ModalSubscription: Subscription;
  DataList:IEvaluatedAddFactsReport;
  workerName: string;
  workerFolder: string;
  calendarData: ISchedule;
  Periodo:string = "";
  workerPosition:string = "";
  Activatetable:boolean = false;
  SesionData = this.loginService.GetUserSession();

  constructor(
    private modalService: AddoutstandingfactmodalService,
    private peopletobeevaluatedService: PeopletobeevaluatedService,
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private loginService: LoginService
  ) { }

   async ngOnInit(): Promise<void>{
    this.utilsService.showLoading();
    this.DataFromsessionStorage = JSON.parse(sessionStorage.getItem("userdata"));
    const data = await this.calendarService.getDataScheduleApi().toPromise()
    this.calendarData = data;
    //////console.log(this.calendarData)

    this.ModalSubscription = this.modalService.$modal.subscribe((value: boolean) => {
      this.ShowModal = value
    })
    this.utilsService.closeLoading();
  }

  async FilterData(CalendarCode:string): Promise<void>  {
    if(this.Periodo === ""){
      Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
    }else{
      this.utilsService.showLoading();
      const response = await this.peopletobeevaluatedService.GetWorkersList(this.SesionData.codPuesto, CalendarCode).toPromise();
      ////console.log(response)
      if(response.registros.length === 0){
        Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
      }else{
        this.Activatetable = true;     
        this.DataList = response.registros
        this.utilsService.closeLoading();;
      }
    }
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  ngOnDestroy(): void {
   this.ModalSubscription.unsubscribe()
  }


  OpenModal(nombre:string,ficha:string, posicion:string):void{
    this.workerName = nombre;
    this.workerFolder = ficha;
    this.workerPosition = posicion
    this.modalService.$modal.emit(true);
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

}
