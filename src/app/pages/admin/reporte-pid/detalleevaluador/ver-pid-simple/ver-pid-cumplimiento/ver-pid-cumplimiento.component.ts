import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IEstructuraVeredictoPid } from 'src/app/interfaces/IEstructuraVeredictoPid';
import { IPIDComplianceRegisterVeredict } from 'src/app/interfaces/IPIDComplianceRegisterVeredict';
import { IPIDIndicatorsAndDeliverables } from 'src/app/interfaces/IPIDIndicatorsAndDeliverables';
import { LoginService } from 'src/app/services/auth/login.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-pid-cumplimiento',
  templateUrl: './ver-pid-cumplimiento.component.html',
  styleUrls: ['./ver-pid-cumplimiento.component.css']
})
export class VerPidCumplimientoComponent implements OnInit {
  EvaluatorFeedbackDesc: string = ""; 
  EvaluatorData = this.loginService.GetUserSession();
  Type: string = ""
  CodPuestoEvaluado: string = this.route.snapshot.paramMap.get('CodigoPuestoEvaluado');
  CodFichaEvaluado: string = this.route.snapshot.paramMap.get('CodFicha'); 
  CodCalendario: string = this.route.snapshot.paramMap.get('CodCalendario');
  Evaluate: boolean = false;
  ShowEvaluateButtons: boolean = false;
  ShowEvaluatedAlerts: boolean = false;
  DataToShow:any;
  ShowVerdictBadge: boolean = false;
  msgs: any[] = []
  ConstDeliverablesresponse: IPIDIndicatorsAndDeliverables
  ConstIndicatorsresponse: IPIDIndicatorsAndDeliverables 
  Competenciesresponse: any

  CompetenciaSeleccionada: string = ""
  ObjetivoDesarrollo: string = "";
  IniciativaYMejora1: string = "";
  IniciativaYMejora2: string = "";
  IniciativaYMejora3: string = "";

  selectedIndicatorItem1: string = "";
  selectedIndicatorItem2: string = "";
  selectedIndicatorItem3: string = "";
  selectedDeliverableItem1: string = "";
  selectedDeliverableItem2: string = "";
  selectedDeliverableItem3: string = "";

  selectedItems1Label: string = 'Indicadores 1';
  selectedItems2Label: string = 'Indicadores 2';
  selectedItems3Label: string = 'Indicadores 3';
  selectedItems4Label: string = 'Entregables 1';
  selectedItems5Label: string = 'Entregables 2';
  selectedItems6Label: string = 'Entregables 3';

  Item1StartDate: string;
  Item2StartDate: string;
  Item3StartDate: string;
  Item1EndDate: string;
  Item2EndDate: string;
  Item3EndDate: string;

  PidDetail1: boolean = false;
  PidDetail2: boolean = false;
  PidDetail3: boolean = false;

  IsItem1Attached: boolean = false;
  IsItem2Attached: boolean = false;
  IsItem3Attached: boolean = false;

  Item1AttachedItem: any;
  Item2AttachedItem: any;
  Item3AttachedItem: any;

  AttachedItem1Label: string = "Adjuntar";
  AttachedItem2Label: string = "Adjuntar";
  AttachedItem3Label: string = "Adjuntar";

  Item1ComplianceAcomplishDate: string;
  Item2ComplianceAcomplishDate: string;
  Item3ComplianceAcomplishDate: string;

  Item1ComplianceAcomplishPercentage: string;
  Item2ComplianceAcomplishPercentage: string;
  Item3ComplianceAcomplishPercentage: string;

  Commentary1: string = "";
  Commentary2: string = "";
  Commentary3: string = "";

  AttachedDocument1: string = ""
  AttachedDocument2: string = ""
  AttachedDocument3: string = ""

  NameAttachedDocument1: string = ""
  NameAttachedDocument2: string = ""
  NameAttachedDocument3: string = ""

  EvaluatorcomentarioCumplimiento: string = ""

  constructor( private route: ActivatedRoute, private router: Router, private utilService: UtilsService, private pidService: PidService, private loginService: LoginService) { }

  async ngOnInit(): Promise<void> {
    this.utilService.showLoading();
    const DataToShowOnScreen: any = await ((this.pidService.GetEvaluatedPIDTable(this.CodFichaEvaluado,this.CodCalendario).toPromise()))

      if(DataToShowOnScreen.registros.estadoCumplimientoEvaluado && !DataToShowOnScreen.registros.estadoCumplimientoEvaluador){
        this.Type === 'EVALUATE'
        ////console.log('PENDIENTE DE VEREDICTO')
        this.DataToShow = DataToShowOnScreen;
        this.ConstIndicatorsresponse= await ((this.pidService.GetIndicatorsListForMultiselect()).toPromise());
        this.ConstDeliverablesresponse = await ((this.pidService.GetDeliverablesListForMultiselect()).toPromise());
        this.Competenciesresponse = await ((this.pidService.GetCompetenciesForSelect(this.CodPuestoEvaluado, this.CodCalendario)).toPromise());
        this.ShowEvaluateButtons = true;
        this.LoadDataTable();
        
        this.utilService.closeLoading();
      }else if(DataToShowOnScreen.registros.estadoCumplimientoEvaluado && DataToShowOnScreen.registros.estadoCumplimientoEvaluador){
        this.Type === 'EVALUATED'
        ////console.log('EVALUADOOOOOOOOO')
        
        if(DataToShowOnScreen.registros.veredictoCumplimiento){
          ////console.log('Aprobado')
          this.msgs = [
            { severity: 'success', summary: 'CUMPLIMIENTO DE PID APROBADO', detail: '- El cumplimiento del plan individual de desarrollo fue aprobado.' },
          ];
        }else{
          ////console.log('Rechazado')
          this.msgs = [
            { severity: 'error', summary: 'CUMPLIMIENTO DE PID RECHAZADO', detail: '- El cumplimiento del plan individual de desarrollo fue rechazado.' }
          ];
        }

        this.ShowVerdictBadge = true;
        this.ShowEvaluateButtons = false;
        this.DataToShow = DataToShowOnScreen;
        this.ConstIndicatorsresponse= await ((this.pidService.GetIndicatorsListForMultiselect()).toPromise());
        this.ConstDeliverablesresponse = await ((this.pidService.GetDeliverablesListForMultiselect()).toPromise());
        this.Competenciesresponse = await ((this.pidService.GetCompetenciesForSelect(this.CodPuestoEvaluado, this.CodCalendario)).toPromise());

        ////console.log(this.DataToShow)
    
      
        this.LoadDataTable();
        
       this.utilService.closeLoading();
      }
      else{
        Swal.fire('AVISO','El evaluado seleccionado, aún no a registrado su registro de cumplimiento de plan individual de desarrollo.','warning').then(() => {
          this.router.navigate(['/home/evaluador-seguimiento-pid']);
        })
      }

      
  }

 LoadDataTable(){
    let RowData1 = this.DataToShow.registros.detalles.filter(data => data.orden === 1)[0]
    let RowData2 = this.DataToShow.registros.detalles.filter(data => data.orden === 2)[0]
    let RowData3 = this.DataToShow.registros.detalles.filter(data => data.orden === 3)[0]

    if(RowData1 != undefined)  {
      this.CompetenciaSeleccionada = RowData1.competencia.codigo
      this.ObjetivoDesarrollo = RowData1.objetivoDesarrollo
      this.IniciativaYMejora1 = RowData1.iniciativaAcciones
      this.selectedIndicatorItem1 = RowData1.codigosIndicadores[0]
      this.selectedDeliverableItem1 = RowData1.codigosEntregables[0]
      this.Item1StartDate = this.FormatDate(RowData1.fechaInicioIniciativa)
      this.Item1EndDate = this.FormatDate(RowData1.fechaFinIniciativa)
      
      if(RowData1.fechaEjecucion){
        this.Item1ComplianceAcomplishDate = this.FormatDate(RowData1.fechaEjecucion)
      }
      this.Item1ComplianceAcomplishPercentage =RowData1.cumplimiento
      this.Commentary1 = RowData1.comentario
    
        this.AttachedDocument1 = RowData1.rutaArchivo
        this.NameAttachedDocument1 = RowData1.nombreArchivo

     
        this.AttachedItem1Label = RowData1.nombreArchivo
        this.AttachedDocument1 = RowData1.rutaArchivo
 
    }

    if(RowData2)  {
      this.IniciativaYMejora2 = RowData2.iniciativaAcciones
      this.selectedIndicatorItem2 = RowData2.codigosIndicadores[0]
      this.selectedDeliverableItem2 = RowData2.codigosEntregables[0]
      this.Item2StartDate = this.FormatDate(RowData2.fechaInicioIniciativa)
      this.Item2EndDate = this.FormatDate(RowData2.fechaFinIniciativa)

      if(RowData2.fechaEjecucion){
        this.Item2ComplianceAcomplishDate = this.FormatDate(RowData2.fechaEjecucion)
      }
      this.Item2ComplianceAcomplishPercentage = RowData2.cumplimiento
      this.Commentary2 = RowData2.comentario
   
        this.AttachedDocument2 = RowData2.rutaArchivo
        this.NameAttachedDocument2 = RowData2.nombreArchivo
    

    
        this.AttachedItem2Label = RowData2.nombreArchivo
        this.AttachedDocument2 = RowData2.rutaArchivo
      
    }

    if(RowData3)  {
      this.IniciativaYMejora3 = RowData3.iniciativaAcciones
      this.selectedIndicatorItem3 = RowData3.codigosIndicadores[0]
      this.selectedDeliverableItem3 = RowData3.codigosEntregables[0]
      this.Item3StartDate = this.FormatDate(RowData3.fechaInicioIniciativa)
      this.Item3EndDate = this.FormatDate(RowData3.fechaFinIniciativa)

      if(RowData3.fechaEjecucion){
        this.Item3ComplianceAcomplishDate = this.FormatDate(RowData3.fechaEjecucion)
      }
      this.Item3ComplianceAcomplishPercentage = RowData3.cumplimiento
      this.Commentary3 = RowData3.comentario
  
    
        this.AttachedDocument3 = RowData3.rutaArchivo
        this.NameAttachedDocument3 = RowData3.nombreArchivo
    


        this.AttachedItem3Label = RowData3.nombreArchivo
        this.AttachedDocument3 = RowData3.rutaArchivo

     }


    if(this.DataToShow.registros.comentarioCumplimiento){
      if(this.DataToShow.registros.comentarioCumplimiento != ''){
        ////console.log(this.DataToShow.registros.comentarioCumplimiento)
        let commentary = this.DataToShow.registros.comentarioCumplimiento.trim()
        this.EvaluatorcomentarioCumplimiento = commentary
      }
    }
  }
  
  FormatDate(dateString: string): string {
    if(dateString != undefined || ''){
      return this.utilService.GetFormatedDate(dateString)
    }
  }

  removeTimeSuffix(dateTime: string): string {
    return dateTime.slice(0, -9); 
  }
  
  GetCompetencyName(CodCompetencia: string){
    ////console.log(CodCompetencia)
    let Competency:any = this.Competenciesresponse
    Competency = Competency.registros.find((data: { codigo: string; }) => data.codigo === CodCompetencia)
    return Competency.titulo
  }

  GetDeliverableName(CodEntregable: number) {
    if (CodEntregable !== undefined && this.ConstDeliverablesresponse && this.ConstDeliverablesresponse.registros) {
      const Deliverable = this.ConstDeliverablesresponse.registros.find((data: { codigo: number; }) => data.codigo === CodEntregable);
      return Deliverable ? Deliverable.valor : ''; 
    }
    return ''; 
  }

  GetIndicatorName(CodIndicador: number) {
    if (CodIndicador !== undefined && this.ConstIndicatorsresponse && this.ConstIndicatorsresponse.registros) {
      const Indicator = this.ConstIndicatorsresponse.registros.find((data: { codigo: number; }) => data.codigo === CodIndicador);
      return Indicator ? Indicator.valor : ''; 
    }
    return ''; 
  }
  

}