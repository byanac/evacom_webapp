import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { Subscription } from 'rxjs';
import { ITeam } from 'src/app/interfaces/ITeam';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { TeamService } from 'src/app/services/team/team.service';
import Swal from 'sweetalert2';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { IAdminPidEvaluatorsProgressionReport } from 'src/app/interfaces/IAdminPidEvaluatosProgressionReport';


@Component({
  selector: 'app-reporte-pid',
  templateUrl: './reporte-pid.component.html',
  styleUrls: ['./reporte-pid.component.css']
})
export class ReportePidComponent implements OnInit, OnDestroy{
private gerencyJsonSubscription: Subscription = new Subscription();
private teamJsonSubscription: Subscription = new Subscription();
private FichaSubscription: Subscription = new Subscription();
private PuestoSubscription: Subscription = new Subscription();
private PeriodoSubscription: Subscription = new Subscription();  codFicha!: string;
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
  ShowFilters: boolean = false;
  Estado: string = ''


  modalidytext:string = "";
  typetext:string = "";
  titletoshow:string = "";
  ChiefView:boolean = false;
  EvaluatedView:boolean = false;
  Redirecttoevaluatedview:boolean = false;
  Redirecttoevaluatorview: boolean = false;
  ShowViewEvaluatedPIDButton: boolean = false;
  ShowViewEvaluatedCompliancePIDButton: boolean = false;
  DataList:IAdminPidEvaluatorsProgressionReport[] = [];

  constructor(
    private router: Router,
    private evaluatorsService: EvaluatorsService,
    private utilsService: UtilsService,  
    private teamService: TeamService,
    private gerencyteamService: GerencyteamsmultiselectService, 
    private filepositionperiodService: FilepositionperiodfilterService, 
    private pidService: PidService
  ) {}

  async ngOnInit(): Promise<void>{
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

    this.FichaSubscription = await this.filepositionperiodService.$FileValue.subscribe((value: string) => {
      this.Ficha = value
    })

    this.PuestoSubscription = await this.filepositionperiodService.$PositionValue.subscribe((value: string) => {
      this.Puesto = value
    })

    this.PeriodoSubscription = await this.filepositionperiodService.$PeriodValue.subscribe((value: string) => {
      this.Periodo = value
    })
    const fuePorRegresar = sessionStorage.getItem('retornaDetallePID');
    if (fuePorRegresar === 'true') {
    let withSessions=false;
      const fichaReporteRetro = sessionStorage.getItem('fichaReporteRetro');
      if ((fichaReporteRetro)  && (fichaReporteRetro.length>0)){
        this.Ficha=fichaReporteRetro;          
        withSessions=true;
      }
      const puestoReporteRetro = sessionStorage.getItem('puestoReporteRetro');
      if ((puestoReporteRetro)  && (puestoReporteRetro.length>0)){
        this.Puesto=puestoReporteRetro;          
        withSessions=true;
      }
      const calendarioReporteRetro = sessionStorage.getItem('calendarioReporteRetro');
      if ((calendarioReporteRetro)  && (calendarioReporteRetro.length>0)){
        this.Periodo=calendarioReporteRetro;          
        withSessions=true;
      }
      const gerenciasReporteRetro = sessionStorage.getItem('gerenciasReporteRetro');
      if ((gerenciasReporteRetro)  && (gerenciasReporteRetro.length>0)){
        this.GerenciasToSend=JSON.parse(gerenciasReporteRetro);          
        withSessions=true;
      }
      const equipoReporteRetro = sessionStorage.getItem('equipoReporteRetro');
      if ((equipoReporteRetro)  && (equipoReporteRetro.length>0)){
        this.TeamsToSend=JSON.parse(equipoReporteRetro);          
        withSessions=true;
      }
       sessionStorage.removeItem('retornaDetallePID');
      if (withSessions) {
        this.FilterData();
      }
    } 

    this.utilsService.closeLoading();;
  }

  async LoadChiefData(){
    this.utilsService.showLoading();
    const BodyKnowledgeFilter: any = {
      ficha: "",
      puesto: "",
      calendario: "",
      gerencias: "",
      equipo: "",
    };
    const data = await this.pidService.GetAdminPIDandCompliancePIDReport(BodyKnowledgeFilter).toPromise();
    if(data.registros.length === 0){
      return Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
    }else{
      ////console.log(data.registros)
    
      ////console.log(this.Periodo);  
      if(this.Redirecttoevaluatorview){
        this.ChiefView = true;
      }

      if(this.Redirecttoevaluatedview){
        this.EvaluatedView = true;
      }

      ////console.log(this.ChiefView);
      ////console.log(this.EvaluatedView)
      //console.log('a')
      this.DataList = data.registros  
      this.utilsService.closeLoading();
    }
  }

  ngOnDestroy(): void {
    if (this.gerencyJsonSubscription) {
      this.gerencyJsonSubscription.unsubscribe();
    }
    if (this.teamJsonSubscription) {
      this.teamJsonSubscription.unsubscribe();
    }
    if (this.FichaSubscription) {
      this.FichaSubscription.unsubscribe();
    }
    if (this.PuestoSubscription) {
      this.PuestoSubscription.unsubscribe();
    }
    if (this.PeriodoSubscription) {
      this.PeriodoSubscription.unsubscribe();
    }
  }
  

  async FilterData(){
    this.gerencyteamService.CloseAllSelects();
    switch(true) {
      case this.Periodo === '':
        Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
        break;
      default:
        this.utilsService.showLoading();
        let todosValue = (this.Estado === undefined || this.Estado === '')  
        let estado = (this.Estado === "true")
        let BodyKnowledgeFilter: any = {
            ficha: this.Ficha === '' ? '' :  this.utilsService.padLeftZeros(this.Ficha),
            puesto: this.Puesto,
            calendario: this.Periodo,
            gerencias: this.GerenciasToSend,
            equipo: this.TeamsToSend,
          };
        try {
          ////console.log(BodyKnowledgeFilter)
          //this.LoadChiefData();
          const data = await this.pidService.GetAdminPIDandCompliancePIDReport(BodyKnowledgeFilter).toPromise();
          if(data.registros.length === 0){
            Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
          }else{
            this.Redirecttoevaluatorview = true;
            this.ShowViewEvaluatedPIDButton = true;
            this.DataList = data;
             sessionStorage.setItem('fichaReporteRetro', this.Ficha);
      sessionStorage.setItem('puestoReporteRetro', this.Puesto);
      sessionStorage.setItem('calendarioReporteRetro', this.Periodo);
      sessionStorage.setItem('gerenciasReporteRetro', JSON.stringify(this.GerenciasToSend));
      sessionStorage.setItem('equipoReporteRetro', JSON.stringify(this.TeamsToSend));
            ////console.log(this.DataList)
            if(this.Redirecttoevaluatorview){
              this.ChiefView = true;
            }
      
            if(this.Redirecttoevaluatedview){
              this.EvaluatedView = true;
            }
            this.utilsService.closeLoading();;
          }
        } catch (error) {
          Swal.fire("ERROR",error.message,"error")
        }
    }
  }

  RefreshFilters():void {
    this.utilsService.ResetAllFilterValues();
    this.Estado = "";
     sessionStorage.removeItem('fichaReporteRetro');
      sessionStorage.removeItem('puestoReporteRetro');
      sessionStorage.removeItem('calendarioReporteRetro');
      sessionStorage.removeItem('gerenciasReporteRetro');
      sessionStorage.removeItem('equipoReporteRetro');
      this.DataList=[];
  }

}
