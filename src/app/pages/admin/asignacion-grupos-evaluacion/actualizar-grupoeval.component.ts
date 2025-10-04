import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IEvaluationGroupFilter } from 'src/app/interfaces/IEvaluationGroupFilter';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { ITeam } from 'src/app/interfaces/ITeam';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { TeamService } from 'src/app/services/team/team.service';
import { UpdateevalgroupService } from 'src/app/services/updateevalgroup/updateevalgroup.service';
import Swal from 'sweetalert2';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { IUpdateEvalGroupReport } from 'src/app/interfaces/IUpdateEvalGroupReport';
import { UtilsService } from 'src/app/services/utils/utils.service';


@Component({
  selector: 'app-actualizar-grupoeval',
  templateUrl: './actualizar-grupoeval.component.html',
  styleUrls: ['./actualizar-grupoeval.component.css']
})
export class ActualizarGrupoevalComponent {
  private gerencyJsonSubscription!: Subscription;
  private teamJsonSubscription!: Subscription;
  private ReloadTableSubscription!: Subscription;
  private ReloadTableDataSubscription!: Subscription;
  private FichaSubscription!: Subscription;
  private PuestoSubscription!: Subscription;
  private PeriodoSubscription!: Subscription;

  calendarData!: ISchedule

  ModalValue: boolean = false;
  codPuesto: string = '';
  
  startuptable: boolean = false;
  modalswitch: boolean = false;

  Periodo:string = ''

  GerenciasToSend: string[];
  TeamsToSend: string[];

  Teamdata!: ITeam[] | null;
  Teamdatabkup!: ITeam[] | null;
  
  nombreTrabajador: string = "";

  Ficha: string = ''
  Puesto: string = ''
  DataList:IUpdateEvalGroupReport

  SavedBodyKnowledgeFilter: IEvaluationGroupFilter

  constructor(
    private teamService: TeamService,
    private gerencyteamService: GerencyteamsmultiselectService, 
    private CalendarService: CalendarService,
    private UpdateEvalGroupService: UpdateevalgroupService,
    private filepositionperiodService: FilepositionperiodfilterService, 
    private utilsService: UtilsService
    )
    {}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading()
    const data = await this.CalendarService.getDataScheduleApi().toPromise()
    this.calendarData = data;

    this.gerencyJsonSubscription = await this.gerencyteamService.$GerencyArray.subscribe(async (jsonGerencias: string[]) => {
      //////console.log(jsonGerencias)
      this.GerenciasToSend = jsonGerencias;

      this.teamService.getDataTeamApi(jsonGerencias).subscribe(value => {
        this.Teamdata = [value];
        this.Teamdatabkup = this.Teamdata;
      })
    });

    this.teamJsonSubscription = await this.gerencyteamService.$TeamArray.subscribe(async (jsonEquipos: string[]) => {
      //////console.log(jsonEquipos)
      this.TeamsToSend = jsonEquipos
    })

    this.ReloadTableSubscription = await this.UpdateEvalGroupService.$modal.subscribe(async (data: boolean) => {
      this.ModalValue = data
      //////console.log('valor de $modal ',data)
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

    this.ReloadTableDataSubscription = await this.UpdateEvalGroupService.$reloadDataOnTable.subscribe(async (data: boolean) => {
      ////console.log('valor de $reloadDataOnTable ',data)
      if(data){
        this.utilsService.showLoading();
        ////console.log('Recargando datos')
        const response = await this.GetTableData(this.SavedBodyKnowledgeFilter)
        ////console.log(response.registros)
        this.DataList = response.registros
        this.utilsService.closeLoading();;
        ////console.log('Data recargada')
      }
    })

    this.utilsService.closeLoading();;
  }
  
  ngOnDestroy(): void {
    this.gerencyJsonSubscription.unsubscribe();
    this.teamJsonSubscription.unsubscribe();
    this.ReloadTableSubscription.unsubscribe();
    this.ReloadTableDataSubscription.unsubscribe();
    this.FichaSubscription.unsubscribe();
    this.PuestoSubscription.unsubscribe();
    this.PeriodoSubscription.unsubscribe();
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  async FilterData(){
    this.gerencyteamService.CloseAllSelects();
    switch(true) {
      case this.Periodo === '':
        Swal.fire('El campo periodo está vacío', 'Debe seleccionar el campo de periodo para continuar.','error');
        break;
      default:
        this.utilsService.showLoading();
        ////console.log(this.GerenciasToSend)
        ////console.log(this.TeamsToSend)
        const BodyAutoEvaluationFilter: IEvaluationGroupFilter = {
          ficha: this.Ficha === '' ? '' :  this.utilsService.padLeftZeros(this.Ficha),
          puesto: this.Puesto,
          calendario: this.Periodo,
          gerencias: this.GerenciasToSend,
          equipo: this.TeamsToSend,
        };
        ////console.log(BodyAutoEvaluationFilter)
        try {
          this.SavedBodyKnowledgeFilter = BodyAutoEvaluationFilter
          const response = await this.GetTableData(BodyAutoEvaluationFilter)
          if(response.registros.length === 0){
            Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
          }else{
            this.DataList = response.registros
            this.startuptable = true;
            this.utilsService.closeLoading();;
          }
        } catch (error) {
          Swal.fire("ERROR",error.message,"error")
        }
    }
  }

  RefreshFilters():void {
    this.utilsService.ResetAllFilterValues();
  }

  async GetTableData(body: any){
    const data = await this.UpdateEvalGroupService.getEvalGroupReport(body).toPromise();
    return data
  }

  OpenModal(cod: string, nombretrabajador: string): void  {
    this.codPuesto = cod;
    this.nombreTrabajador = nombretrabajador;
    this.UpdateEvalGroupService.$modal.emit(true)
  }
}
