import { Component, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { IAutoEvalReport } from 'src/app/interfaces/IAutoEvalReport';
import { IFilterBody } from 'src/app/interfaces/IFilterBody';
import { ITeam } from 'src/app/interfaces/ITeam';
import { AutoevaluationService } from 'src/app/services/autoevaluation/autoevaluation.service';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { TeamService } from 'src/app/services/team/team.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-reporte-autoevaluacion',
  templateUrl: './reporte-autoevaluacion.component.html',
  styleUrls: ['./reporte-autoevaluacion.component.css']
})
export class ReporteAutoevaluacionComponent implements OnInit {
  private gerencyJsonSubscription: Subscription = new Subscription();
  private teamJsonSubscription: Subscription = new Subscription();
  private FichaSubscription: Subscription = new Subscription();
  private PuestoSubscription: Subscription = new Subscription();
  private PeriodoSubscription: Subscription = new Subscription(); 
  private EstadoSubscription: Subscription = new Subscription();

  startuptable: boolean = false;
  EvaluatedFile: string = "";
  EvaluatedPosition: string = "";
  ShowResultIframe: boolean = false;

  DataList:IAutoEvalReport[] = []
  GerenciasToSend: string[] = [];
  TeamsToSend: string[] = [];  
  Teamdata!: ITeam[] | null;
  Teamdatabkup!: ITeam[] | null;

  Periodo: string = '';
  Ficha: string = '';
  Puesto: string = '';
  Estado: string = '';

  constructor(
    private filepositionperiodService: FilepositionperiodfilterService, 
    private AutoEvaluationService: AutoevaluationService,
    private gerencyteamService: GerencyteamsmultiselectService,
    private teamService: TeamService,
    private sanitizer: DomSanitizer,
    private EmailService: SendemailService,
    private renderer: Renderer2,
    private utilsService: UtilsService){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading()
    this.gerencyJsonSubscription = await this.gerencyteamService.$GerencyArray.subscribe(async (jsonGerencias) => {
      this.GerenciasToSend = jsonGerencias;

      this.teamService.getDataTeamApi(jsonGerencias).subscribe(value => {
        this.Teamdata = [value];
        this.Teamdatabkup = this.Teamdata;
      })
    });

    this.teamJsonSubscription  = await this.gerencyteamService.$TeamArray.subscribe(async (jsonEquipos) => {
      ////////console.log(jsonEquipos)
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

    this.utilsService.closeLoading();
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
        try {
          //////console.log(BodyKnowledgeFilter)
          //////console.log(JSON.stringify(BodyKnowledgeFilter))
          const data = await this.AutoEvaluationService.getAutoEvalReport(BodyKnowledgeFilter).toPromise();
          if(data.registros.length === 0){
            Swal.fire("NOTIFICACIÓN","No se encontraron registros.","info")
          }else{
            //////console.log(data.registros)
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

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
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
          this.EmailService.sendAutoEvaluationEmail(this.Periodo, codpuesto, codficha)
          .subscribe({
            next: (data) => {
              //////console.log(data);
              return Swal.fire("Recordatorio enviado de manera exitosa.", "","success"
              );
            },
            error: (error) => {
              console.error("Error:", error.message);
              return Swal.fire("Error al enviar el recordatorio.",'',"error");
            }
          });    
        }
      })
    }    
  }

  OpenResultIframe(codFicha: string, codPuesto: string, ): void{
      this.EvaluatedFile = codFicha;
      this.EvaluatedPosition = codPuesto;
      this.ShowResultIframe = true;
      this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
  }

  get iframeSrc(): SafeResourceUrl {
    const url = `/#/Iframe/${this.EvaluatedFile}/${this.EvaluatedPosition}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  closeIframe(): void{
    this.ShowResultIframe = false;
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

}
