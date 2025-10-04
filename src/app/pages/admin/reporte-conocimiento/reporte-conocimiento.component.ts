import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { IFilterBody } from 'src/app/interfaces/IFilterBody';
import { IKnowledgeReportResponse } from 'src/app/interfaces/IKnowledgeReportResponse';
import { ITeam } from 'src/app/interfaces/ITeam';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { KnowledgeService } from 'src/app/services/knowledge/knowledge.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { TeamService } from 'src/app/services/team/team.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reporte-conocimiento',
  templateUrl: './reporte-conocimiento.component.html',
  styleUrls: ['./reporte-conocimiento.component.css']
})
export class ReporteConocimientoComponent {
private gerencyJsonSubscription: Subscription = new Subscription();
private teamJsonSubscription: Subscription = new Subscription();
private FichaSubscription: Subscription = new Subscription();
private PuestoSubscription: Subscription = new Subscription();
private PeriodoSubscription: Subscription = new Subscription();  
private EstadoSubscription: Subscription = new Subscription();

  codFicha!: string;
  codPuesto!: string;

  Ficha: string = '';
  Puesto: string = '';
  Periodo: string = '';
  Estado: string

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

  DataList:IKnowledgeReportResponse

constructor(
  private EmailService: SendemailService,
  private teamService: TeamService,
  private gerencyteamService: GerencyteamsmultiselectService, 
  private knowledgeService: KnowledgeService,
  private filepositionperiodService: FilepositionperiodfilterService,
  private utilsService: UtilsService
){}

  async ngOnInit(): Promise<void> {
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

    this.EstadoSubscription = await this.filepositionperiodService.$StatusValue.subscribe((value: string) => {
      this.Estado = value
    })
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
  if (this.EstadoSubscription) {
    this.EstadoSubscription.unsubscribe();
  }
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
        //console.log(this.Estado)
        let todosValue = (this.Estado === undefined || this.Estado === '') 
        let estado = (this.Estado === "true")
        const BodyKnowledgeFilter: IFilterBody = {
          ficha: this.Ficha === '' ? '' :  this.utilsService.padLeftZeros(this.Ficha),
          puesto: this.Puesto,
          calendario: this.Periodo,
          estado: estado,
          gerencias: this.GerenciasToSend,
          equipo: this.TeamsToSend,
          todos: todosValue
        };
        //console.log(BodyKnowledgeFilter)
        try {
         // ////console.log(BodyKnowledgeFilter)
          const data = await this.knowledgeService.getKnowledgeReport(BodyKnowledgeFilter).toPromise();
          if(data.registros.length === 0){
            Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
          }else{
            //console.log(data.registros)
            this.DataList = data.registros
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
    this.Estado = "";
  }

  sendEmail(nombre: string, codpuesto: string, codficha: string){
    if(this.Periodo != ''){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas enviar un recordatorio por correo a ${nombre}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading();
          this.EmailService.sendKnowledgeEmail(this.Periodo, codpuesto, codficha)
          .subscribe({
            next: (data) => {
              ////console.log(data);
              Swal.fire("Recordatorio enviado de manera exitosa.", "","success"
              );
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al enviar el recordatorio.",'',"error");
            }
          });    
        }
      })
    }    
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }
}

