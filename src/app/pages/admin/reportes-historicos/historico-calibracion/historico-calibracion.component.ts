import { UtilsService } from 'src/app/services/utils/utils.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import Swal from 'sweetalert2';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';

@Component({
  selector: 'app-historico-calibracion',
  templateUrl: './historico-calibracion.component.html',
  styleUrls: ['./historico-calibracion.component.css']
})
export class HistoricoCalibracionComponent implements OnInit {
  data: any = [];
  calendarData!: ISchedule
  showComparativeModal: boolean = false;
  Periodo: any = [];
  Activatetable: boolean = false;
  CalibrationData: any[] = [];

  constructor(private utilsService: UtilsService, private CalendarService: CalendarService, private calibrationService: CalibrationService) {}

  async ngOnInit(): Promise<any> {
    this.utilsService.showLoading();
    let data: any;
    data = await this.CalendarService.getCalendarVigencies().toPromise()
    data.registros = data.registros.filter((item: { vigente: boolean; }) => item.vigente === false);
    this.Periodo = data.registros[data.registros.length - 1].vCodigo
    this.calendarData = data;
    this.utilsService.closeLoading();
  }

  async FilterData(): Promise<any>{
    //console.log(this.Periodo)
    
    if(this.Periodo.length === 0){
        Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
      }else{
        this.utilsService.showLoading();
        const data = await this.calibrationService.GetCalibrationReport(this.Periodo.vCodigo).toPromise(); 
        if(data.registros.length === 0){
          Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
        }else{
          this.Activatetable = true;     
          this.data = data
          this.utilsService.closeLoading();;
        }
      }
  }
  

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  ShowModal(item: any[]) {
    this.CalibrationData = item;
    this.showComparativeModal = true;
  }

  closeModal() {
    this.showComparativeModal = false;
    this.CalibrationData = [];
  }
}
