import { UtilsService } from './../../../services/utils/utils.service';
import { Component, OnInit } from '@angular/core';
import { IEstructuraRegistroPid } from 'src/app/interfaces/IEstructuraRegistroPid';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { IPIDIndicatorsAndDeliverables } from 'src/app/interfaces/IPIDIndicatorsAndDeliverables';
import { IPIDRecord } from 'src/app/interfaces/IPIDRecord';
import { LoginService } from 'src/app/services/auth/login.service';
import { PidService } from 'src/app/services/pid/pid.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-pid-original',
  templateUrl: './registro-pid-original.component.html',
  styleUrls: ['./registro-pid-original.component.css'],
})
export class RegistroPidOriginalComponent implements OnInit {
  competencias: any;
  Indicadores: IPIDIndicatorsAndDeliverables | any;
  Entregables: IPIDIndicatorsAndDeliverables | any;
  UserData:ILoginData = this.loginService.GetUserSession();
  DataToShow:IPIDRecord;
  CalendarCode: string = ""
  Competenciesresponse: any
  ConstDeliverablesresponse: IPIDIndicatorsAndDeliverables | any
  ConstIndicatorsresponse: IPIDIndicatorsAndDeliverables | any

  EvaluadoVaARegistrar: boolean = false;
  EvaluadoVaAActualizar: boolean = false;
  Aprobado:boolean = false;
  Rechazado:boolean = false;
  PendienteVeredicto:boolean = false;

  CompetenciaSeleccionada: string = ""
  ObjetivoDesarrollo: string = "";
  
  IniciativaYMejora1: string = "";
  IniciativaYMejora2: string = "";
  IniciativaYMejora3: string = "";

  selectedIndicatorItem1: string = "";
  selectedIndicatorItem2: string = "";
  selectedIndicatorItem3: string = "";
  DisabledIndicatorItem1Code: string = ""
  DisabledIndicatorItem2Code: string = ""
  DisabledIndicatorItem3Code: string = ""

  selectedDeliverableItem1: string = "";
  selectedDeliverableItem2: string = "";
  selectedDeliverableItem3: string = "";
  DisabledDeliverableItem1Code: string = ""
  DisabledDeliverableItem2Code: string = ""
  DisabledDeliverableItem3Code: string = ""

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

  msgs: any = [];
  selectCompetencyWarning: boolean = false;
  fullObjectiveWarning: boolean = false;
  Items1BorderRed: boolean = false;
  Items2BorderRed: boolean = false;
  Items3BorderRed: boolean = false;

  EvaluatorcomentarioRegistro: string = ""

  constructor(private loginService: LoginService, private pidService: PidService, private utilService: UtilsService, private router: Router) { }

  async ngOnInit(): Promise<any> {
    this.utilService.showLoading();
  
    const codCalendarEvaluated = this.UserData.permisos.find(data => data.evaluado === true);

    try {
    const evaluatedValidation:any = await this.utilService.GetEvaluatorStatusForPhase('eval','ficha',this.UserData.ficha,codCalendarEvaluated.calendario).toPromise();
      let EvaluatedCalendarCode: any = this.UserData;
      EvaluatedCalendarCode = EvaluatedCalendarCode.permisos.find((data: { evaluado: boolean; }) => data.evaluado === true)
      this.CalendarCode = EvaluatedCalendarCode.calendario

      this.ConstIndicatorsresponse = await ((this.pidService.GetIndicatorsListForMultiselect()).toPromise());
      this.ConstDeliverablesresponse = await ((this.pidService.GetDeliverablesListForMultiselect()).toPromise())

      this.Competenciesresponse = await ((this.pidService.GetCompetenciesForSelect(this.UserData.codPuesto, EvaluatedCalendarCode.calendario)).toPromise());
      const DataToShowOnScreen: any = await ((this.pidService.GetEvaluatedPIDTable(this.UserData.ficha,EvaluatedCalendarCode.calendario).toPromise()))

      this.DataToShow = DataToShowOnScreen;
      this.competencias = this.Competenciesresponse.registros;

      this.Indicadores =  this.ConstIndicatorsresponse.registros.filter((data: { estado: number; }) => data.estado === 1);
      ////console.log(this.Indicadores)
      this.Entregables = this.ConstDeliverablesresponse.registros.filter((data: { estado: number; }) => data.estado === 1);

      if(!this.DataToShow.registros.estadoRegistroEvaluado && !this.DataToShow.registros.estadoRegistroEvaluador && !this.DataToShow.registros.veredictoRegistro){
        //////console.log('PRIMER REGISTRO')
        this.EvaluadoVaARegistrar = true;
        this.Aprobado = false
      }

      if(this.DataToShow.registros.estadoRegistroEvaluado && this.DataToShow.registros.estadoRegistroEvaluador && this.DataToShow.registros.veredictoRegistro){
        //////console.log('APROBADO')
        this.Aprobado = true;
        this.msgs = [{ severity: 'success', summary: 'PID APROBADO', detail: '- El plan individual de desarrollo fue aprobado.' }]
        this.LoadDataTable();
      }

      if(this.DataToShow.registros.estadoRegistroEvaluado && this.DataToShow.registros.estadoRegistroEvaluador && !this.DataToShow.registros.veredictoRegistro){
        //////console.log('RECHAZADO')
        this.Rechazado = true;
        this.EvaluadoVaAActualizar = true;
        this.msgs = [{ severity: 'error', summary: 'PID RECHAZADO', detail: '- El plan individual de desarrollo fue rechazado.' }]
        this.LoadDataTable();
      }

      if(this.DataToShow.registros.estadoRegistroEvaluado && !this.DataToShow.registros.estadoRegistroEvaluador){
        this.msgs = [{ severity: 'info', summary: 'PID PENDIENTE DE EVALUACIÓN', detail: '- El plan individual de desarrollo aún no fue evaluado por tu evaluador asignado.' }]
        //////console.log('PENDIENTE DE VEREDICTO')
        this.PendienteVeredicto = true;
        //////console.log(this.DataToShow)
        this.LoadDataTable();

      }
      this.utilService.closeLoading();
    } catch (error) {
      if (error.status === 502) {
        Swal.fire(
          'AVISO',
          `${error.error.mensaje}.`,
          'warning'
        ).then(() => {
          this.router.navigateByUrl('home');
        });
      } else {
        Swal.fire(
          'Error',
          'Ocurrió un error inesperado.',
          'error'
        ).then(() => {
          this.router.navigateByUrl('home');
        });
      }
    }

   
  }

  LoadDataTable() {
    // Ordenar los detalles por el campo 'orden'
    const orderedData = this.DataToShow.registros.detalles.sort((a, b) => a.orden - b.orden);
  
    // Filtrar y asignar datos en orden
    let RowData1 = orderedData.find(data => data.orden === 1);
    let RowData2 = orderedData.find(data => data.orden === 2);
    let RowData3 = orderedData.find(data => data.orden === 3);
  
    if (RowData1 != undefined)  {
      //////console.log('Tendría que ir en primera línea: ', RowData1);
      this.CompetenciaSeleccionada = RowData1.competencia.codigo;
      this.ObjetivoDesarrollo = RowData1.objetivoDesarrollo;
      this.IniciativaYMejora1 = RowData1.iniciativaAcciones;
      this.selectedIndicatorItem1 = RowData1.codigosIndicadores[0];
      this.selectedDeliverableItem1 = RowData1.codigosEntregables[0];
      this.Item1StartDate = RowData1.fechaInicioIniciativa
      this.Item1EndDate = RowData1.fechaFinIniciativa

      this.LoadDeliverableAndIndicatorDeactivatedOnSelects(this.selectedIndicatorItem1,false,true,1)
      this.LoadDeliverableAndIndicatorDeactivatedOnSelects(this.selectedDeliverableItem1,true,false,1)
    }
  
    if (RowData2 != undefined)  {
      //////console.log('Tendría que ir en segunda línea: ', RowData2);
      this.IniciativaYMejora2 = RowData2.iniciativaAcciones;
      this.selectedIndicatorItem2 = RowData2.codigosIndicadores[0];
      this.selectedDeliverableItem2 = RowData2.codigosEntregables[0];
      this.Item2StartDate = RowData2.fechaInicioIniciativa
      this.Item2EndDate = RowData2.fechaFinIniciativa

      this.LoadDeliverableAndIndicatorDeactivatedOnSelects(this.selectedIndicatorItem2,false,true,2)
      this.LoadDeliverableAndIndicatorDeactivatedOnSelects(this.selectedDeliverableItem2,true,false,2)
    }
  
    if (RowData3 != undefined)  {
      //////console.log('Tendría que ir en tercera línea: ', RowData3);
      this.IniciativaYMejora3 = RowData3.iniciativaAcciones;
      this.selectedIndicatorItem3 = RowData3.codigosIndicadores[0];
      this.selectedDeliverableItem3 = RowData3.codigosEntregables[0];
      this.Item3StartDate = RowData3.fechaInicioIniciativa
      this.Item3EndDate = RowData3.fechaFinIniciativa

       this.LoadDeliverableAndIndicatorDeactivatedOnSelects(this.selectedIndicatorItem3,false,true,3)
       this.LoadDeliverableAndIndicatorDeactivatedOnSelects(this.selectedDeliverableItem3,true,false,3)
    }

    if(this.DataToShow.registros.comentarioRegistro){
      //////console.log('a')
      if(this.DataToShow.registros.comentarioRegistro != ''){
        //////console.log(this.DataToShow.registros.comentarioRegistro)
        let commentary = this.DataToShow.registros.comentarioRegistro.trim()
        this.EvaluatorcomentarioRegistro = commentary
      }
    }
  }

  LoadDeliverableAndIndicatorDeactivatedOnSelects(cod: string , Deliverable: boolean, Indicator: boolean, Orden : number){
    if(cod)
      {
        if(Deliverable){
          if(this.ConstDeliverablesresponse.registros.find((data: { codigo: string; }) => data.codigo === cod)){
            let EntregableEncontrado = this.ConstDeliverablesresponse.registros.find(data => data.codigo === cod)
            if(EntregableEncontrado.estado === 0){
              this.Entregables.push(EntregableEncontrado)

              switch (Orden) {
                case 1:
                  this.DisabledDeliverableItem1Code = EntregableEncontrado.codigo;
                  break;
                case 2:
                  this.DisabledDeliverableItem2Code = EntregableEncontrado.codigo;
                  break;
                case 3:
                  this.DisabledDeliverableItem3Code = EntregableEncontrado.codigo;
                  break;
              }              

            }
          }
        }

        if(Indicator){
          if(this.ConstIndicatorsresponse.registros.find((data: { codigo: string; }) => data.codigo === cod)){
            let IndicadorEncontrado = this.ConstIndicatorsresponse.registros.find(data => data.codigo === cod)
            if(IndicadorEncontrado.estado === 0){
              this.Indicadores.push(IndicadorEncontrado)

              
              switch (Orden) {
                case 1:
                  this.DisabledIndicatorItem1Code = IndicadorEncontrado.codigo;
                  break;
                case 2:
                  this.DisabledIndicatorItem2Code = IndicadorEncontrado.codigo;
                  break;
                case 3:
                  this.DisabledIndicatorItem3Code = IndicadorEncontrado.codigo;
                  break;
              }  
            }
          }
        }

    }

  }
  
  removeTimeSuffix(dateTime: string): string {
    return dateTime.slice(0, -9); 
  }
  
  RegisterPID(update: boolean): void{
    this.ValidateEmptyLevelsAndReturnBody(update)
  }

  GetCompetencyName(CodCompetencia: string){
    let Competency:any = this.Competenciesresponse
    Competency = Competency.registros.find((data: { codigo: string; }) => data.codigo === CodCompetencia)
    return Competency.valor
  }


   GetDeliverableName(CodEntregable:number){
    let Deliverable:any = this.ConstDeliverablesresponse
    Deliverable = Deliverable.registros.find((data: { codigo: number; }) => data.codigo === CodEntregable)
    return Deliverable.valor
  }

  GetIndicatorName(CodIndicador:number){
    let Indicator:any = this.ConstIndicatorsresponse
    Indicator = Indicator.registros.find((data: { codigo: number; }) => data.codigo === CodIndicador)
    return Indicator.valor
  }
  

  ValidateEmptyLevelsAndReturnBody(update: boolean): any{

    let BodyToSend: IEstructuraRegistroPid = {
      idPid: this.DataToShow.registros.idPid,
      evaluador: {
        codigoFicha: this.DataToShow.registros.evaluador.codigoFicha
      },
      evaluado: {
        codigoFicha: this.DataToShow.registros.evaluado.codigoFicha
      },
      codCalendario: this.CalendarCode,
      detalles: [
      ]
    };


    if(this.CompetenciaSeleccionada != ""){
      //////console.log('Competencia OK')
      this.selectCompetencyWarning = false;
    }else{
      this.selectCompetencyWarning = true;
      return Swal.fire('ALERTA',"Debe de seleccionar una competencia para continuar.", "warning")
    }

    if(this.ObjetivoDesarrollo != "" && this.CompetenciaSeleccionada != ""){
      //////console.log('Objetivo Desarrollo OK')
      this.fullObjectiveWarning = false;
    }else{
      this.fullObjectiveWarning = true;
      return Swal.fire('ALERTA',"Debe de ingresar su objetivo de desarrollo para continuar.", "warning")
    }

    if(this.IniciativaYMejora1 != ""){
      //////console.log(this.IniciativaYMejora1)
      //////console.log('Iniciativa de mejora 1 OK')

      if(this.ObjetivoDesarrollo != "" && 
        this.IniciativaYMejora1 != "" && 
        this.selectedIndicatorItem1 != "" && 
        this.selectedDeliverableItem1 != "" && 
        this.Item1StartDate && 
        this.Item1EndDate)
        {

          if(this.selectedDeliverableItem1 === this.DisabledDeliverableItem1Code){
            this.Items1BorderRed = true;
            return Swal.fire('ALERTA',"El entregable seleccionado ha sido eliminado. Por favor, seleccione otro entregable.", "warning")
          }

          if(this.selectedIndicatorItem1 === this.DisabledIndicatorItem1Code){
            this.Items1BorderRed = true;
            return Swal.fire('ALERTA',"El indicador seleccionado ha sido eliminado. Por favor, seleccione otro indicador.", "warning")
          }


        let Nivel1BodyCompletado:any = {
          idPidDetalle: update? this.DataToShow.registros.detalles[0].idPidDetalle : 0,
          orden: 1,
          competencia: {
            codigo: this.CompetenciaSeleccionada,
            titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
          },
          objetivoDesarrollo: this.ObjetivoDesarrollo,
          iniciativaAcciones: this.IniciativaYMejora1,
          codigosIndicadores: [parseInt(this.selectedIndicatorItem1)],
          codigosEntregables: [parseInt(this.selectedDeliverableItem1)],
          fechaInicioIniciativa: this.Item1StartDate ,
          fechaFinIniciativa: this.Item1EndDate ,
          comentario: ""
        }

        if(this.Item1StartDate > this.Item1EndDate){
          this.Items1BorderRed = true;
          return Swal.fire('ALERTA',"La fecha de fin no puede ser menor que la fecha de inicio.", "warning")
       }else{
        BodyToSend.detalles.unshift(Nivel1BodyCompletado);
       }

      }else{
        this.Items1BorderRed = true;
        return Swal.fire('ALERTA',"Debe completar la iniciativa para poder registrar su PID.", "warning")
      }  
    }else{
      this.Items1BorderRed = true;
      return Swal.fire('ALERTA',"Debe completar la iniciativa para poder registrar su PID.", "warning")
    }


    if(this.IniciativaYMejora2 === ""){
      //////console.log('Iniciativa de mejora 2 VACIA')
    }else{
      if(this.ObjetivoDesarrollo != "" && 
        this.IniciativaYMejora2 != "" && 
        this.selectedIndicatorItem2 != "" && 
        this.selectedDeliverableItem2 != "" && 
        this.Item2StartDate != undefined && 
        this.Item2EndDate != undefined &&
        this.Item2StartDate &&
        this.Item2EndDate &&
        this.Item2StartDate != "" && 
        this.Item2EndDate != ""
       )
        {
        let Competency:any = this.Competenciesresponse
        Competency = Competency.registros.find(data => data.codigo === this.CompetenciaSeleccionada)

        if(this.selectedDeliverableItem2 === this.DisabledDeliverableItem2Code){
          this.Items2BorderRed = true;
          return Swal.fire('ALERTA',"El entregable seleccionado ha sido eliminado. Por favor, seleccione otro entregable.", "warning")
        }

        if(this.selectedIndicatorItem2 === this.DisabledIndicatorItem2Code){
          this.Items2BorderRed = true;
          return Swal.fire('ALERTA',"El indicador seleccionado ha sido eliminado. Por favor, seleccione otro indicador.", "warning")
        }


        let Nivel2BodyCompletado:any = {
          idPidDetalle: update? this.DataToShow.registros.detalles[1].idPidDetalle : 0,
          orden: 2,
          competencia: {
            codigo: this.CompetenciaSeleccionada,
            titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
          },
          objetivoDesarrollo: this.ObjetivoDesarrollo,
          iniciativaAcciones: this.IniciativaYMejora2,
          codigosIndicadores: [parseInt(this.selectedIndicatorItem2)],
          codigosEntregables: [parseInt(this.selectedDeliverableItem2)],
          fechaInicioIniciativa: this.Item2StartDate ,
          fechaFinIniciativa: this.Item2EndDate ,
          comentario: ""
        }
       
        if(this.Item2StartDate > this.Item2EndDate){
          this.Items2BorderRed = true;
          return Swal.fire('ALERTA',"La fecha de fin no puede ser menor que la fecha de inicio.", "warning")
       }else{
        BodyToSend.detalles.splice(2, 0, Nivel2BodyCompletado);
       }
   

      }else{
        this.Items2BorderRed = true;
        return Swal.fire('ALERTA',"Debe completar la iniciativa para poder registrar su PID.", "warning")
      }

      if(this.IniciativaYMejora3 === ""){
        //////console.log('Iniciativa de mejora 3 VACIA')
      }else{
        if(this.ObjetivoDesarrollo != "" && 
          this.IniciativaYMejora3 != "" && 
          this.selectedIndicatorItem3 != "" && 
          this.selectedDeliverableItem3 != "" && 
          this.Item3StartDate != undefined && 
          this.Item3EndDate != undefined &&
          this.Item3StartDate &&
          this.Item3EndDate &&
          this.Item3StartDate != "" && 
          this.Item3EndDate != ""
         )
          {
          let Competency:any = this.Competenciesresponse
          Competency = Competency.registros.find(data => data.codigo === this.CompetenciaSeleccionada)
      
          if(this.selectedDeliverableItem3 === this.DisabledDeliverableItem3Code){
            this.Items3BorderRed = true;
            return Swal.fire('ALERTA',"El entregable seleccionado ha sido eliminado. Por favor, seleccione otro entregable.", "warning")
          }

          if(this.selectedIndicatorItem3 === this.DisabledIndicatorItem3Code){
            this.Items3BorderRed = true;
            return Swal.fire('ALERTA',"El indicador seleccionado ha sido eliminado. Por favor, seleccione otro indicador.", "warning")
          }
  

          let Nivel3BodyCompletado:any = {
            idPidDetalle: update? this.DataToShow.registros.detalles[2].idPidDetalle : 0,
            orden: 3,
            competencia: {
              codigo: this.CompetenciaSeleccionada,
              titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
            },
            objetivoDesarrollo: this.ObjetivoDesarrollo,
            iniciativaAcciones: this.IniciativaYMejora3,
            codigosIndicadores: [parseInt(this.selectedIndicatorItem3)],
            codigosEntregables: [parseInt(this.selectedDeliverableItem3)],
            fechaInicioIniciativa: this.Item3StartDate ,
            fechaFinIniciativa: this.Item3EndDate ,
            comentario: ""
          }
         
          if(this.Item3StartDate > this.Item3EndDate){
            this.Items3BorderRed = true;
            return Swal.fire('ALERTA',"La fecha de fin no puede ser menor que la fecha de inicio.", "warning")
         }else{
          BodyToSend.detalles.splice(3, 0, Nivel3BodyCompletado);
         }
    
  
        }else{
          this.Items3BorderRed = true;
          return Swal.fire('ALERTA',"Debe completar la iniciativa para poder registrar su PID.", "warning")
        }
      }
    }

    //////console.log('subir')
    //////console.log(BodyToSend)
    let text: string = update? 'actualizar' : 'registrar';
    let textCapitalized: string = update? 'Actualizar' : 'Registrar';
    let finishedText = update? 'actualizado' : 'registrado';
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas ${text} tu PID?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: textCapitalized,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilService.showLoading();
        this.pidService.SavePidForEvaluated(this.DataToShow.registros.evaluador.codigoFicha,this.DataToShow.registros.evaluado.codigoFicha,this.CalendarCode,BodyToSend).subscribe({
          next: (data) => {
            //////console.log(data)
            Swal.fire({
              title:  `PID ${finishedText}`,
              text: `El PID fue ${finishedText} con éxito.`,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              window.location.reload();
            })
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error :(",
              text: error.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
            //////console.log("Error:", error.message)
          }
        });
      }
    })
  }

  onTextChange1ObjetivoDesarrollo(newText: string): void {
    newText = newText.trim(); // Elimina espacios innecesarios
    //////console.log("Objetivo de Desarrollo actualizado:", newText);

    if (this.ObjetivoDesarrollo !== newText) { // Asegura que solo se actualice si es un valor nuevo
        this.ObjetivoDesarrollo = newText;
    }
}


  onTextChangeIniciativaYMejora(newText: string, position: number): void {
    newText = newText.trim(); // Elimina espacios innecesarios
    //////console.log("Iniciativa o Mejora actualizada:", newText);

    if (position === 1) {
        if (this.IniciativaYMejora1 !== newText) { // Asegura que solo se actualice si es un valor nuevo
            this.IniciativaYMejora1 = newText;
        }
    } else if (position === 2) {
        if (this.IniciativaYMejora2 !== newText) {
            this.IniciativaYMejora2 = newText;
        }
    } else if (position === 3) {
        if (this.IniciativaYMejora3 !== newText) {
            this.IniciativaYMejora3 = newText;
        }
    }
}


  FormatDate(dateString: string): string {
    if(dateString != undefined){
      return this.utilService.GetFormatedDate(dateString)
    }
  }

  
}
