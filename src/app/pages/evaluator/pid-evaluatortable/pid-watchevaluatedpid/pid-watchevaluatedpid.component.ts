import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IPIDEvaluatorRegisterVeredict } from 'src/app/interfaces/IPIDEvaluatorRegisterVeredict';
import { IPIDIndicatorsAndDeliverables } from 'src/app/interfaces/IPIDIndicatorsAndDeliverables';
import { LoginService } from 'src/app/services/auth/login.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pid-watchevaluatedpid',
  templateUrl: './pid-watchevaluatedpid.component.html',
  styleUrls: ['./pid-watchevaluatedpid.component.css']
})
export class PidWatchevaluatedpidComponent implements OnInit {
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

  EvaluatorDenyReason: string = ""

  constructor( private route: ActivatedRoute, private router: Router, private utilService: UtilsService, private pidService: PidService, private loginService: LoginService) { }

  async ngOnInit(): Promise<void> {
    this.utilService.showLoading();
    const DataToShowOnScreen: any = await ((this.pidService.GetEvaluatedPIDTable(this.CodFichaEvaluado,this.CodCalendario).toPromise()))

      if(DataToShowOnScreen.registros.estadoRegistroEvaluado && !DataToShowOnScreen.registros.estadoRegistroEvaluador){
        this.Type === 'EVALUATE'
        ////console.log('PENDIENTE DE VEREDICTO')
        this.DataToShow = DataToShowOnScreen;
        this.ConstIndicatorsresponse= await ((this.pidService.GetIndicatorsListForMultiselect()).toPromise());
        this.ConstDeliverablesresponse = await ((this.pidService.GetDeliverablesListForMultiselect()).toPromise());
        this.Competenciesresponse = await ((this.pidService.GetCompetenciesForSelect(this.CodPuestoEvaluado, this.CodCalendario)).toPromise());
        this.ShowEvaluateButtons = true;
          
        this.LoadDataTable();
        
        this.utilService.closeLoading();
      }else if(DataToShowOnScreen.registros.estadoRegistroEvaluado && DataToShowOnScreen.registros.estadoRegistroEvaluador){
        this.Type === 'EVALUATED'
        ////console.log('EVALUADOOOOOOOOO')
        
        if(DataToShowOnScreen.registros.veredictoRegistro){
          ////console.log('Aprobado')
          this.msgs = [
            { severity: 'success', summary: 'PID APROBADO', detail: '- El plan individual de desarrollo aprobado.' },
          ];
        }else{
          ////console.log('Rechazado')
          this.msgs = [
            { severity: 'error', summary: 'PID RECHAZADO', detail: '- El plan individual de desarrollo rechazado.' }
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
        Swal.fire('AVISO','El evaluado seleccionado, aún no a registrado su registro de plan individual de desarrollo.','warning').then(() => {
          this.router.navigate(['/home/evaluador-validacion-pid']);
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
      this.Item1StartDate = this.removeTimeSuffix(RowData1.fechaInicioIniciativa)
      this.Item1EndDate = this.removeTimeSuffix(RowData1.fechaFinIniciativa)
    }

    if(RowData2 != undefined)  {
      this.IniciativaYMejora2 = RowData2.iniciativaAcciones
      this.selectedIndicatorItem2 = RowData2.codigosIndicadores[0]
      this.selectedDeliverableItem2 = RowData2.codigosEntregables[0]
      this.Item2StartDate = this.removeTimeSuffix(RowData2.fechaInicioIniciativa)
      this.Item2EndDate = this.removeTimeSuffix(RowData2.fechaFinIniciativa)
    }

    if(RowData3 != undefined)  {
      this.IniciativaYMejora3 = RowData3.iniciativaAcciones
      this.selectedIndicatorItem3 = RowData3.codigosIndicadores[0]
      this.selectedDeliverableItem3 = RowData3.codigosEntregables[0]
      this.Item3StartDate = this.removeTimeSuffix(RowData3.fechaInicioIniciativa)
      this.Item3EndDate = this.removeTimeSuffix(RowData3.fechaFinIniciativa)
     }

     if(this.DataToShow.registros.comentarioRegistro){
      ////console.log('a')
      if(this.DataToShow.registros.comentarioRegistro != ''){
        ////console.log(this.DataToShow.registros.comentarioRegistro)
        let commentary = this.DataToShow.registros.comentarioRegistro.trim()
        this.EvaluatorDenyReason = commentary
      }
    }
  }

  MostrarModalDeRechazo(){
    Swal.fire({
      title: 'Ingrese la razón del rechazo',
      input: 'textarea',
      inputPlaceholder: 'Escriba la razón del rechazo...',
      showCancelButton: true,
      confirmButtonText: 'Continuar',
      cancelButtonText: 'Cancelar',
      preConfirm: (observation) => {
        if (!observation) {
          Swal.showValidationMessage('Debe llenar en el campo de razón de rechazo');
          return false;
        }
        return observation;
      }
    }).then((result) => {
      if (result.value) {
        this.EvaluatorDenyReason = result.value;
        ////console.log('Opini:', this.EvaluatorDenyReason);
        this.DarVeredicto(false,true)
      }
}) 
}

DarVeredicto(Veredicto: boolean, ConObservacion: boolean):any{
  let veredictoTexto: string = Veredicto? 'aprobar' : 'rechazar'
  let veredictoTextoCapitalizado: string = Veredicto? 'Aprobar' : 'Rechazar'
  ////console.log(this.DataToShow)
  let BodyToSend: IPIDEvaluatorRegisterVeredict;
  
  if(ConObservacion){
    BodyToSend = {
      veredictoRegistro: Veredicto,
      comentarioRegistro: this.EvaluatorDenyReason
   };
  }else{
    BodyToSend = {
      veredictoRegistro: Veredicto,
      comentarioRegistro: ""
   };
  }

    ////console.log(BodyToSend)
    let descriptiontext = ConObservacion ? `¿Estás seguro de que deseas ${veredictoTexto} el PID del evaluado ${this.DataToShow.registros.evaluado.apellidosNombres} con el siguiente rechazo?:  "${this.EvaluatorDenyReason}"` : `¿Estás seguro de que deseas ${veredictoTexto} el PID del evaluado ${this.DataToShow.registros.evaluado.apellidosNombres}?`
    let minuscula = Veredicto? "aprobación" : "rechazo";
    let titletext = Veredicto? "aprobado" : "rechazado";

    Swal.fire({
      title:  "Aviso",
      text: descriptiontext,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: Veredicto? '#007bff' : '#bd2130',
      confirmButtonText: veredictoTextoCapitalizado,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilService.showLoading();
        this.pidService.SaveEvaluatorVerdictPID(this.DataToShow.registros.evaluador.codigoFicha,this.CodFichaEvaluado,this.CodCalendario,BodyToSend).subscribe({
          next: (data) => {
            ////console.log(data)
            ////console.log(titletext)
            Swal.fire({
              title:  `Evaluación de PID ${titletext}`,
              text: `Su ${minuscula} de PID fue registrado con éxito.`,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(()=> {
              window.location.reload()
            })
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error :(",
              text: error.error.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
          }
        });
      }
    })
  }

  FormatDate(dateString: string): string {
    if(dateString != undefined){
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
      return Deliverable ? Deliverable.valor : ''; // Devolver '' si no se encuentra el entregable
    }
    return ''; // Devolver '' si CodEntregable es undefined o no hay registros
  }

  GetIndicatorName(CodIndicador: number) {
    if (CodIndicador !== undefined && this.ConstIndicatorsresponse && this.ConstIndicatorsresponse.registros) {
      const Indicator = this.ConstIndicatorsresponse.registros.find((data: { codigo: number; }) => data.codigo === CodIndicador);
      return Indicator ? Indicator.valor : ''; 
    }
    return ''; // Devolver '' si CodIndicador es undefined o no hay registros
  }
  

}
