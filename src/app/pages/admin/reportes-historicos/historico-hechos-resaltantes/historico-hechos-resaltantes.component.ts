import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { TeamService } from 'src/app/services/team/team.service';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { ITeam } from 'src/app/interfaces/ITeam';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { AddoutstandingfactmodalService } from 'src/app/services/addoutstandingfactmodal/addoutstandingfactmodal.service';

@Component({
  selector: 'app-historico-hechos-resaltantes',
  templateUrl: './historico-hechos-resaltantes.component.html',
  styleUrls: ['./historico-hechos-resaltantes.component.css']
})
export class HistoricoHechosResaltantesComponent implements OnInit, OnDestroy{
private gerencyJsonSubscription: Subscription = new Subscription();
private teamJsonSubscription: Subscription = new Subscription();
private FichaSubscription: Subscription = new Subscription();
private PuestoSubscription: Subscription = new Subscription();
private PeriodoSubscription: Subscription = new Subscription();  calendarData: ISchedule;
  startuptable: boolean = false;
  DataList:IEvaluatorsEvaluationsProgress
  Periodo: string = "";

  GerenciasToSend: string[] = [];
  TeamsToSend: string[] = [];
  Teamdata!: ITeam[] | null;
  Teamdatabkup!: ITeam[] | null;
  filtervalue:string = '';
  statusvalue:string | boolean = '';
  gerencyvalue:string = ''
  tempfiltervalue:string = '';
  tempstatusvalue:string | boolean = '';
  tempgerencyvalue:string = '';
  Ficha: string = '';
  Puesto: string = '';
  Estado: string = '';
  
  constructor(
    private utilsService: UtilsService, 
    private calendarService: CalendarService,
    private evaluatorsService: EvaluatorsService,
    private teamService: TeamService,
    private gerencyteamService: GerencyteamsmultiselectService, 
    private FilePositionPeriodService: FilepositionperiodfilterService,
    private Factsservice: AddoutstandingfactmodalService
  ) { }

  async ngOnInit(): Promise<any> {
    this.utilsService.showLoading();
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

    this.FichaSubscription = await this.FilePositionPeriodService.$FileValue.subscribe((value: string) => {
      this.Ficha = value
    })

    this.PuestoSubscription = await this.FilePositionPeriodService.$PositionValue.subscribe((value: string) => {
      this.Puesto = value
    })

    this.PeriodoSubscription = await this.FilePositionPeriodService.$PeriodValue.subscribe((value: string) => {
      this.Periodo = value
    })

    this.utilsService.closeLoading();
  }

  ngOnDestroy(): void {
    this.gerencyJsonSubscription.unsubscribe();
    this.teamJsonSubscription.unsubscribe();
    this.FichaSubscription.unsubscribe();
    this.PuestoSubscription.unsubscribe();
    this.PeriodoSubscription.unsubscribe();
  }

  async FilterData(): Promise<any>{
  this.gerencyteamService.CloseAllSelects();
  //console.log(this.Periodo)
   switch(true) {
     case this.Periodo === '':
       Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
       break;
     default:
       this.utilsService.showLoading();
       const BodyKnowledgeFilter: any = {
         ficha: this.Ficha === '' ? '' :  this.utilsService.padLeftZeros(this.Ficha),
         puesto: this.Puesto,
         calendario: this.Periodo,
         gerencias: this.GerenciasToSend,
         equipo: this.TeamsToSend,
       };

       ////console.log(BodyKnowledgeFilter)
       try {
         //console.log(BodyKnowledgeFilter)
         const data = await this.Factsservice.PostHistoricEvaluatorsFactsReport(BodyKnowledgeFilter).toPromise();
         if(data.registros.length === 0){
           Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
         }else{
           this.DataList = data.registros  
           ////console.log(data.registros)
           this.utilsService.closeLoading();;
           this.startuptable = true;
         }
       } catch (error) {
         Swal.fire("ERROR",error.message,"error")
       }
       
   }
 }

 RefreshFilters():void {
  this.utilsService.ResetAllFilterValues();
  this.Estado = "";
}


  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

}
