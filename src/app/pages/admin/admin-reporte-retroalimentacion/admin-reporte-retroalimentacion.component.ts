import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { Subscription } from 'rxjs';
import { IFilterBody } from 'src/app/interfaces/IFilterBody';
import { IKnowledgeReportResponse } from 'src/app/interfaces/IKnowledgeReportResponse';
import { ITeam } from 'src/app/interfaces/ITeam';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { KnowledgeService } from 'src/app/services/knowledge/knowledge.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { TeamService } from 'src/app/services/team/team.service';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/auth/login.service';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { AdminFeedbackEvaluatorsProgressionReport } from 'src/app/interfaces/AdminFeedbackEvaluatorsProgressionReport ';

@Component({
  selector: 'app-admin-reporte-retroalimentacion',
  templateUrl: './admin-reporte-retroalimentacion.component.html',
  styleUrls: ['./admin-reporte-retroalimentacion.component.css']
})
export class AdminReporteRetroalimentacionComponent implements OnInit, OnDestroy{
private gerencyJsonSubscription: Subscription = new Subscription();
private teamJsonSubscription: Subscription = new Subscription();
private FichaSubscription: Subscription = new Subscription();
private PuestoSubscription: Subscription = new Subscription();
private PeriodoSubscription: Subscription = new Subscription();  

  codFicha!: string;
  codPuesto!: string;
  Ficha: string = '';
  Puesto: string = '';
  Periodo: string = '';
  GerenciasToSend: string[] = [];
  TeamsToSend: string[] = [];
  startuptable: boolean = false;
  Teamdata!: ITeam[] | null;
  Teamdatabkup!: ITeam[] | null;
  filtervalue:string = '';
  statusvalue:string | boolean = '';
  gerencyvalue:string = ''
  tempfiltervalue:string = '';
  tempstatusvalue:string | boolean = '';
  tempgerencyvalue:string = '';
  Estado: string = ''

  titletoshow:string = ""
  ChiefView:boolean = false;
  EvaluatedView:boolean = false;
  ShowFilters: boolean = false;
  ShowChangeFeedbackPeriodModal: boolean = false;
  ChiefOptionOn:boolean = false;
  EvaluatedOptionOn:boolean = false;
  DataList:AdminFeedbackEvaluatorsProgressionReport 

  constructor(
    private feedbackService: FeedbackService,
    private utilsService: UtilsService,  
    private teamService: TeamService,
    private gerencyteamService: GerencyteamsmultiselectService, 
    private filepositionperiodService: FilepositionperiodfilterService, 
  ) {}

  async ngOnInit(): Promise<void>{
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

    this.FichaSubscription = await this.filepositionperiodService.$FileValue.subscribe((value: string) => {
      this.Ficha = value
    })

    this.PuestoSubscription = await this.filepositionperiodService.$PositionValue.subscribe((value: string) => {
      this.Puesto = value
    })

    this.PeriodoSubscription = await this.filepositionperiodService.$PeriodValue.subscribe((value: string) => {
      this.Periodo = value
    })

    this.ChiefOptionOn = true;
    this.ShowFilters = true;
    this.utilsService.closeLoading();
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  async LoadChiefData(){
    this.utilsService.showLoading();
    const BodyKnowledgeFilter: any = {
      ficha: this.Ficha,
      puesto: this.Puesto,
      calendario: this.Periodo,
      gerencias: this.GerenciasToSend,
      equipo: this.TeamsToSend,
    };
    const data = await this.feedbackService.PostGetEvaluatorsFeedbackProgression(BodyKnowledgeFilter).toPromise();
    if(data.registros.length === 0){
      return Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
    }else{
      ////console.log(data.registros)
      this.utilsService.closeLoading();
      this.ChiefView = true;
      return this.DataList = data.registros  
    }
  }

  ngOnDestroy(): void {
    this.gerencyJsonSubscription.unsubscribe();
    this.teamJsonSubscription.unsubscribe();
    this.FichaSubscription.unsubscribe();
    this.PuestoSubscription.unsubscribe();
    this.PeriodoSubscription.unsubscribe();
  }

  async FilterData(){
    this.gerencyteamService.CloseAllSelects();
    switch(true) {
      case this.Periodo === '':
        Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
        break;
      default:
        this.LoadChiefData();
    }
  }

  RefreshFilters():void {
    this.utilsService.ResetAllFilterValues();
    this.Estado = "";
  }

  ShowModal(){
    this.ShowChangeFeedbackPeriodModal = true;
  }

  closeModal(event: boolean) {
    this.ShowChangeFeedbackPeriodModal = event;
  }


}
