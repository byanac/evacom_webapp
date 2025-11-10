import { UtilsService } from 'src/app/services/utils/utils.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import Swal from 'sweetalert2';
import { CalibrationService } from 'src/app/services/calibration/calibration.service';
import { Subscription } from 'rxjs';
import { ITeam } from 'src/app/interfaces/ITeam';
import { TeamService } from 'src/app/services/team/team.service';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
@Component({
  selector: 'app-historico-calibracion',
  templateUrl: './historico-calibracion.component.html',
  styleUrls: ['./historico-calibracion.component.css']
})
export class HistoricoCalibracionComponent implements OnInit {
  private gerencyJsonSubscription: Subscription = new Subscription();
  private teamJsonSubscription: Subscription = new Subscription();
  
  data: any = [];
  calendarData!: ISchedule
  showComparativeModal: boolean = false;
  Periodo: any = [];
    GerenciasToSend: string[] = [];
  TeamsToSend: string[] = [];
   Teamdata!: ITeam[] | null;
    Teamdatabkup!: ITeam[] | null;
  Activatetable: boolean = false;
  CalibrationData: any[] = [];

  constructor(private utilsService: UtilsService, private CalendarService: CalendarService, private calibrationService: CalibrationService,
      private teamService: TeamService,
    private gerencyteamService: GerencyteamsmultiselectService, 
  ) {}

  async ngOnInit(): Promise<any> {
    this.utilsService.showLoading();
    let data: any;
    data = await this.CalendarService.getCalendarVigencies().toPromise()
    data.registros = data.registros.filter((item: { vigente: boolean; }) => item.vigente === false);
    //this.Periodo = data.registros[data.registros.length - 1].vCodigo
    this.calendarData = data;

this.gerencyJsonSubscription = await this.gerencyteamService.$GerencyArray.subscribe(async (jsonGerencias) => {
      this.GerenciasToSend = jsonGerencias;

      this.teamService.getDataTeamApi(jsonGerencias).subscribe(value => {
        this.Teamdata = [value];
        this.Teamdatabkup = this.Teamdata;
      })
    });

    this.teamJsonSubscription = await this.gerencyteamService.$TeamArray.subscribe(async (jsonEquipos) => {
      //////console.log(jsonEquipos)
      this.TeamsToSend = jsonEquipos
    })



    this.utilsService.closeLoading();
  }

  async FilterData(): Promise<any>{
    console.log(this.Periodo)
    this.gerencyteamService.CloseAllSelects();
    if(this.Periodo.length === 0){
        Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
      }else{
        this.utilsService.showLoading();

      const BodyKnowledgeFilter: any = {
         ficha:'',
         puesto: '',
         calendario: this.Periodo.vCodigo,
         gerencias: this.GerenciasToSend,
         equipo: this.TeamsToSend,
       };

         const data = await this.calibrationService.PostCalibrationReport(BodyKnowledgeFilter).toPromise();

       // const data = await this.calibrationService.GetCalibrationReport(this.Periodo.vCodigo).toPromise(); 
        
      //  console.log(data2);
        if(data.registros.length === 0){
          Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
          this.data=[];
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
