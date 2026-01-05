import { Component, OnDestroy, OnInit } from '@angular/core';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { TeamService } from 'src/app/services/team/team.service';
import { ITeam } from 'src/app/interfaces/ITeam';
import { SearchStateService } from 'src/app/services/search-state.service';

@Component({
  selector: 'app-historico-evaluacion',
  templateUrl: './historico-evaluacion.component.html',
  styleUrls: ['./historico-evaluacion.component.css']
})
export class HistoricoEvaluacionComponent implements OnInit, OnDestroy {
  private gerencyJsonSubscription: Subscription = new Subscription();
  private teamJsonSubscription: Subscription = new Subscription();
  private FichaSubscription: Subscription = new Subscription();
  private PuestoSubscription: Subscription = new Subscription();
  private PeriodoSubscription: Subscription = new Subscription();
  startuptable: boolean = false;
  DataList: IEvaluatorsEvaluationsProgress
  Periodo: string = "";
  GerenciasToSend: string[] = [];
  TeamsToSend: string[] = [];
  Teamdata!: ITeam[] | null;
  Teamdatabkup!: ITeam[] | null;

  filtervalue: string = '';
  statusvalue: string | boolean = '';
  gerencyvalue: string = ''
  tempfiltervalue: string = '';
  tempstatusvalue: string | boolean = '';
  tempgerencyvalue: string = '';
  Ficha: string = '';
  Puesto: string = '';
  constructor(
    private utilsService: UtilsService,
    private calendarService: CalendarService,
    private evaluatorsService: EvaluatorsService,
    private gerencyteamService: GerencyteamsmultiselectService,
    private FilePositionPeriodService: FilepositionperiodfilterService,
    private teamService: TeamService,
    private searchState: SearchStateService,

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

    const saved = this.searchState.getState();

    if (saved.periodo) {
      this.Ficha = saved.ficha;
      this.Puesto = saved.puesto;
      this.Periodo = saved.periodo;
      this.GerenciasToSend = saved.gerencias;
      this.TeamsToSend = saved.equipos;

      // Para volver a mostrar la tabla automáticamente
      this.FilterData();
    }


    this.utilsService.closeLoading();
  }

  ngOnDestroy(): void {
    this.gerencyJsonSubscription.unsubscribe();
    this.teamJsonSubscription.unsubscribe();
    this.FichaSubscription.unsubscribe();
    this.PuestoSubscription.unsubscribe();
    this.PeriodoSubscription.unsubscribe();
  }

  RefreshFilters(): void {
    this.utilsService.ResetAllFilterValues();
  }

  async FilterData(): Promise<any> {
    this.gerencyteamService.CloseAllSelects();

    this.searchState.setState({
      ficha: this.Ficha,
      puesto: this.Puesto,
      periodo: this.Periodo,
      gerencias: this.GerenciasToSend,
      equipos: this.TeamsToSend
    });

    switch (true) {
      case this.Periodo === '':
        Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.', 'error');
        break;
      default:
        this.utilsService.showLoading();
        const BodyKnowledgeFilter: any = {
          ficha: this.Ficha === '' ? '' : this.utilsService.padLeftZeros(this.Ficha),
          puesto: this.Puesto,
          calendario: this.Periodo,
          gerencias: this.GerenciasToSend,
          equipo: this.TeamsToSend,
        };

        ////console.log(BodyKnowledgeFilter)
        try {
          //console.log(BodyKnowledgeFilter)
          const data = await this.evaluatorsService.getEvaluatorsReport(BodyKnowledgeFilter).toPromise();
          if (data.registros.length === 0) {
            Swal.fire("NOTIFICACIÓN", "No se encontraron registros.", "info")
          } else {
            this.DataList = data.registros
            ////console.log(data.registros)
            this.utilsService.closeLoading();;
            this.startuptable = true;
          }
        } catch (error) {
          Swal.fire("ERROR", error.message, "error")
        }

    }
  }



  onImgError(event) {
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

}
