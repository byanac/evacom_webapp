import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ITeam } from 'src/app/interfaces/ITeam';
import { LoginService } from 'src/app/services/auth/login.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { TeamService } from 'src/app/services/team/team.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import {SearchStateService} from 'src/app/services/search-state.service';

@Component({
  selector: 'app-reporte-avanceevaluacion',
  templateUrl: './reporte-avanceevaluacion.component.html',
  styleUrls: ['./reporte-avanceevaluacion.component.css']
})
export class ReporteAvanceevaluacionComponent implements OnInit {
private gerencyJsonSubscription: Subscription = new Subscription();
private teamJsonSubscription: Subscription = new Subscription();
private FichaSubscription: Subscription = new Subscription();
private PuestoSubscription: Subscription = new Subscription();
private PeriodoSubscription: Subscription = new Subscription();  ModalSubscription: Subscription;

  DataTest: object[] = [
    {
      codFicha: '00010884',
      Evaluador: "CALDERON LLAGUENTO, JUAN GELASIO",
      unidadOrga: '220-GF',
      codPuesto: '00037719',
      id: 1,
      Puesto: 'Angular Developer',
      TotalEval: 10,
      ProgresEval: 10
    },
    {
      codFicha: '00010884',
      Evaluador: "CALDERON LLAGUENTO, JUAN GELASIO",
      unidadOrga: '220-GF',
      codPuesto: '00037719',
      id: 1,
      Puesto: 'Angular Developer',
      TotalEval: 10,
      ProgresEval: 5
    },
  ]

  ShowModal: boolean

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

  DataList:IEvaluatorsEvaluationsProgress[] = [];

constructor(
  private teamService: TeamService,
  private gerencyteamService: GerencyteamsmultiselectService, 
  private loginService: LoginService,
  private FilePositionPeriodService: FilepositionperiodfilterService,
  private utilsService: UtilsService,
  private evaluatorsService: EvaluatorsService,
  private peopletobeEvaluated: PeopletobeevaluatedService,
  private searchState: SearchStateService
){}

  async ngOnInit(): Promise<void> {
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
    const saved = this.searchState.getState();

  if(saved.periodo){
    this.Ficha = saved.ficha;
    this.Puesto = saved.puesto;
    this.Periodo = saved.periodo;
    this.GerenciasToSend = saved.gerencias;
    this.TeamsToSend = saved.equipos;

    // Para volver a mostrar la tabla automáticamente
    this.FilterData();
  }

    this.utilsService.closeLoading();;
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
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
  

  RefreshFilters():void {
    this.utilsService.ResetAllFilterValues();
    this.DataList = [];
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  async FilterData(){
    this.gerencyteamService.CloseAllSelects();
    this.searchState.setState({
    ficha: this.Ficha,
    puesto: this.Puesto,
    periodo: this.Periodo,
    gerencias: this.GerenciasToSend,
    equipos: this.TeamsToSend
  });


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
          ////console.log(BodyKnowledgeFilter)
          const data = await this.evaluatorsService.getEvaluatorsReport(BodyKnowledgeFilter).toPromise();
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

}
