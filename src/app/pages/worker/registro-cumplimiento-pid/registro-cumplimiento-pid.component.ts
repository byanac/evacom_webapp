import { UtilsService } from './../../../services/utils/utils.service';
import { Component, OnInit } from '@angular/core';
import { IEstructuraRegistroPid } from 'src/app/interfaces/IEstructuraRegistroPid';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { IPIDIndicatorsAndDeliverables } from 'src/app/interfaces/IPIDIndicatorsAndDeliverables';
import { LoginService } from 'src/app/services/auth/login.service';
import { PidService } from 'src/app/services/pid/pid.service';
import Swal from 'sweetalert2';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-cumplimiento-pid',
  templateUrl: './registro-cumplimiento-pid.component.html',
  styleUrls: ['./registro-cumplimiento-pid.component.css']
})
export class RegistroCumplimientoPidComponent implements OnInit {
  competencias: any;
  Indicadores: IPIDIndicatorsAndDeliverables;
  Entregables: IPIDIndicatorsAndDeliverables;
  UserData:ILoginData = this.loginService.GetUserSession();
  DataToShow:any;
  CalendarCode: string = ""
  Competenciesresponse: any
  ConstDeliverablesresponse: IPIDIndicatorsAndDeliverables
  ConstIndicatorsresponse: IPIDIndicatorsAndDeliverables 
  

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
  Item2ComplianceAcomplishPercentage: string | number;
  Item3ComplianceAcomplishPercentage: string;

  Commentary1: string;
  Commentary2: string;
  Commentary3: string;

  AttachedDocument1: string = ""
  NameAttachedDocument1: string = ""
  AttachedDocument2: string = ""
  NameAttachedDocument2: string = ""
  AttachedDocument3: string = ""
  NameAttachedDocument3: string = ""

  MostrarUrlDeEnlaces: boolean = false;

  msgs: any = [];
  selectCompetencyWarning: boolean = false;
  fullObjectiveWarning: boolean = false;
  activeContainer1 = false;
  activeContainer2 = false;
  activeContainer3 = false;

  Items1BorderRed: boolean = false;
  Items2BorderRed: boolean = false;
  Items3BorderRed: boolean = false;

  EvaluatorcomentarioCumplimiento: string = ""

  IsSavingProgress: boolean = false;

  constructor(private loginService: LoginService, private pidService: PidService, private utilService: UtilsService, private router: Router,) { }

  async ngOnInit(): Promise<void> {
    ////console.log(this.AttachedDocument2)
    ////console.log(this.MostrarUrlDeEnlaces)
    this.utilService.showLoading();

    let EvaluatedCalendarCode: any = this.UserData;
    EvaluatedCalendarCode = EvaluatedCalendarCode.permisos.find((data: { evaluado: boolean; }) => data.evaluado === true)
    this.CalendarCode = EvaluatedCalendarCode.calendario

    this.ConstIndicatorsresponse= await ((this.pidService.GetIndicatorsListForMultiselect()).toPromise());
    this.ConstDeliverablesresponse = await ((this.pidService.GetDeliverablesListForMultiselect()).toPromise());
    this.Competenciesresponse = await ((this.pidService.GetCompetenciesForSelect(this.UserData.codPuesto, EvaluatedCalendarCode.calendario)).toPromise());
    ////console.log(this.Competenciesresponse)
    const DataToShowOnScreen: any = await ((this.pidService.GetEvaluatedPIDTable(this.UserData.ficha,EvaluatedCalendarCode.calendario).toPromise()))

    if(DataToShowOnScreen.registros.estadoRegistroEvaluado && DataToShowOnScreen.registros.estadoRegistroEvaluador && DataToShowOnScreen.registros.veredictoRegistro){
      this.DataToShow = DataToShowOnScreen;
      this.competencias = this.Competenciesresponse.registros;
      this.Indicadores = this.ConstIndicatorsresponse;
      this.Entregables = this.ConstDeliverablesresponse;
  
      ////console.log(this.DataToShow.registros.detalles[0])
  
      if(this.DataToShow.registros.detalles[0]){
        this.PidDetail1 = true;
        ////console.log('PidDetail1: ' + this.PidDetail1)
      }
      if(this.DataToShow.registros.detalles[1]){
        this.PidDetail2 = true;
        ////console.log('PidDetail2: ' + this.PidDetail2)
      }
      if(this.DataToShow.registros.detalles[2]){
        this.PidDetail3 = true;
        ////console.log('PidDetail3: ' + this.PidDetail3)
      }
  
      if(!this.DataToShow.registros.estadoCumplimientoEvaluado && !this.DataToShow.registros.estadoCumplimientoEvaluador && !this.DataToShow.registros.veredictoCumplimiento){
        ////console.log('PRIMER REGISTRO')
        this.EvaluadoVaARegistrar = true;
        this.LoadDataTable();
      }
  
      if(this.DataToShow.registros.estadoCumplimientoEvaluado && this.DataToShow.registros.estadoCumplimientoEvaluador && this.DataToShow.registros.veredictoCumplimiento){
        ////console.log('APROBADO')
        this.Aprobado = true;
        this.MostrarUrlDeEnlaces = true;
        this.msgs = [{ severity: 'success', summary: 'CUMPLIMIENTO DE PID APROBADO', detail: '- El cumplimiento del plan individual de desarrollo fue aprobado por tu evaluador asignado.' }]
        this.LoadDataTable();
      }
  
      if(this.DataToShow.registros.estadoCumplimientoEvaluado && this.DataToShow.registros.estadoCumplimientoEvaluador && !this.DataToShow.registros.veredictoCumplimiento){
        ////console.log('RECHAZADO')
        this.Rechazado = true;
        this.EvaluadoVaAActualizar = true;
        this.msgs = [{ severity: 'error', summary: 'CUMPLIMIENTO DE PID RECHAZADO', detail: '- El cumplimiento del plan individual de desarrollo fue rechazado por tu evaluador asignado.' }]
        this.LoadDataTable();
      }
  
      if(this.DataToShow.registros.estadoCumplimientoEvaluado && !this.DataToShow.registros.estadoCumplimientoEvaluador){
        ////console.log('PENDIENTE DE VEREDICTO')
        this.msgs = [{ severity: 'info', summary: 'CUMPLIMIENTO DE PID PENDIENTE DE EVALUACIÓN', detail: '- El cumplimiento del plan individual de desarrollo aún no fue evaluado por tu evaluador asignado.' }]
        this.MostrarUrlDeEnlaces = true;
        this.PendienteVeredicto = true;
        ////console.log(this.DataToShow)
        this.LoadDataTable();
      }

      this.utilService.closeLoading();
    }else{
      Swal.fire('Registro de PID no aprobado', 'El registro de PID del evaluado aún no ha sido aprobado por su evaluador asignado.', 'info').then(() => {
        this.router.navigate(['/home']);
      });
    }
  }

  onFileSelected(event: Event, inputNumber: number): any {
    const input = event.target as HTMLInputElement;
    ////console.log(input)
    ////console.log(inputNumber)
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      ////console.log(`Información del archivo ${inputNumber}:`);
      ////console.log('Nombre del archivo:', file.name);
      ////console.log('Tamaño del archivo (bytes):', file.size);
      ////console.log('Tipo de archivo:', file.type);
      
      if(file.size > 50000000){
        return Swal.fire('Límite de tamaño superado','El archivo adjunto no puede pesar más de 50Mbs','info')
      }

      if(inputNumber === 1){
        this.IsItem1Attached = true;
        this.AttachedItem1Label = file.name
        this.Items1BorderRed = false;
        this.Item1AttachedItem = file
      }else if(inputNumber === 2){
        this.AttachedItem2Label = file.name
        this.Item2AttachedItem = file
        this.Items2BorderRed = false;
        this.IsItem2Attached = true;
      }else if(inputNumber === 3){
        this.AttachedItem3Label = file.name
        this.Item3AttachedItem = file
        this.Items3BorderRed = false;
        this.IsItem3Attached = true;
      }
    }
  }
  
  LoadDataTable(){
    let RowData1 = this.DataToShow.registros.detalles.filter(data => data.orden === 1)[0]
    let RowData2 = this.DataToShow.registros.detalles.filter(data => data.orden === 2)[0]
    let RowData3 = this.DataToShow.registros.detalles.filter(data => data.orden === 3)[0]
    if(RowData1 != undefined)  {
      ////console.log(RowData1)
      this.CompetenciaSeleccionada = RowData1.competencia.codigo
      this.ObjetivoDesarrollo = RowData1.objetivoDesarrollo
      this.IniciativaYMejora1 = RowData1.iniciativaAcciones
      this.selectedIndicatorItem1 = RowData1.codigosIndicadores[0]
      this.selectedDeliverableItem1 = RowData1.codigosEntregables[0]
      this.Item1StartDate = this.FormatDate(RowData1.fechaInicioIniciativa)
      this.Item1EndDate = this.FormatDate(RowData1.fechaFinIniciativa)
      
      if(RowData1.fechaEjecucion){
        this.Item1ComplianceAcomplishDate = RowData1.fechaEjecucion
      }
      this.Item1ComplianceAcomplishPercentage = RowData1.cumplimiento
      this.Commentary1 = RowData1.comentario
      if(RowData1.rutaArchivo){
        this.AttachedItem1Label = RowData1.nombreArchivo
        this.AttachedDocument1 = RowData1.rutaArchivo
        ////console.log('Ruta archivo: ' + this.AttachedDocument1)
        this.NameAttachedDocument1 = RowData1.nombreArchivo
        this.IsItem1Attached = true;
      }

      if(this.Rechazado && this.EvaluadoVaAActualizar){
        this.AttachedItem1Label = RowData1.nombreArchivo
        this.AttachedDocument1 = RowData1.rutaArchivo
        if(RowData1.rutaArchivo){
          this.NameAttachedDocument1 = RowData1.nombreArchivo
          this.IsItem1Attached = true;
        }
      }
    }

    if(RowData2)  {
      this.IniciativaYMejora2 = RowData2.iniciativaAcciones
      this.selectedIndicatorItem2 = RowData2.codigosIndicadores[0]
      this.selectedDeliverableItem2 = RowData2.codigosEntregables[0]
      this.Item2StartDate = this.FormatDate(RowData2.fechaInicioIniciativa)
      this.Item2EndDate = this.FormatDate(RowData2.fechaFinIniciativa)

      if(RowData2.fechaEjecucion){
        this.Item2ComplianceAcomplishDate = RowData2.fechaEjecucion
      }
      this.Item2ComplianceAcomplishPercentage = RowData2.cumplimiento
      this.Commentary2 = RowData2.comentario
      if(RowData2.rutaArchivo){
        this.AttachedItem2Label = RowData2.nombreArchivo
        this.AttachedDocument2 = RowData2.rutaArchivo
        this.NameAttachedDocument2 = RowData2.nombreArchivo
        this.IsItem2Attached = true;
      }

      if(this.Rechazado && this.EvaluadoVaAActualizar){
        this.AttachedItem2Label = RowData2.nombreArchivo
        this.AttachedDocument2 = RowData2.rutaArchivo
        if(RowData2.rutaArchivo){
          this.NameAttachedDocument2 = RowData2.nombreArchivo
          this.IsItem2Attached = true;
        }
      }
    }

    if(RowData3)  {
      this.IniciativaYMejora3 = RowData3.iniciativaAcciones
      this.selectedIndicatorItem3 = RowData3.codigosIndicadores[0]
      this.selectedDeliverableItem3 = RowData3.codigosEntregables[0]
      this.Item3StartDate = this.FormatDate(RowData3.fechaInicioIniciativa)
      this.Item3EndDate = this.FormatDate(RowData3.fechaFinIniciativa)

      if(RowData3.fechaEjecucion){
        this.Item3ComplianceAcomplishDate = RowData3.fechaEjecucion
      }
      this.Item3ComplianceAcomplishPercentage = RowData3.cumplimiento
      this.Commentary3 = RowData3.comentario
  
      if(RowData3.rutaArchivo){
        this.AttachedDocument3 = RowData3.rutaArchivo
        this.NameAttachedDocument3 = RowData3.nombreArchivo
        this.AttachedItem3Label = RowData3.nombreArchivo
        this.IsItem3Attached = true;
      }

      if(this.Rechazado && this.EvaluadoVaAActualizar){
        this.AttachedItem3Label = RowData3.nombreArchivo
        this.AttachedDocument3 = RowData3.rutaArchivo
        if(RowData3.rutaArchivo){
          this.NameAttachedDocument3 = RowData3.nombreArchivo
          this.IsItem3Attached = true;
        }
      }
     }

     if(this.DataToShow.registros.comentarioCumplimiento){
      if(this.DataToShow.registros.comentarioCumplimiento != ''){
        ////console.log(this.DataToShow.registros.comentarioCumplimiento)
        let commentary = this.DataToShow.registros.comentarioCumplimiento.trim()
        this.EvaluatorcomentarioCumplimiento = commentary
      }
    }
     ////console.log(this.Item3ComplianceAcomplishPercentage)
     ////console.log(this.PidDetail3)
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

  CompareStartAndExecutionDate(fecha1Str: string, fecha2Str:string){

    // Fecha 1 en formato "dd/MM/yyyy"
    const [day1, month1, year1] = fecha1Str.split('/');
    const fecha1 = new Date(parseInt(year1), parseInt(month1) - 1, parseInt(day1)); // Meses en JavaScript son 0-indexed
    fecha1.setHours(0, 0, 0, 0);

    // Fecha 2 en formato "yyyy-MM-dd"
    const [year2, month2, day2] = fecha2Str.split('-');
    const fecha2 =new Date(parseInt(year2), parseInt(month2) - 1, parseInt(day2)); // Meses en JavaScript son 0-indexed
    fecha2.setHours(0, 0, 0, 0); // Ajustar hora a las 00:00:00
    if (fecha2 < fecha1) {
      return true
    } else {
      return false
    }
  }
  
  ValidateEmptyLevelsAndReturnBody(update: boolean): any {
    let BodyToSend: IEstructuraRegistroPid = {
      idPid: this.DataToShow.registros.idPid,
      evaluador: {
        codigoFicha: this.DataToShow.registros.evaluador.codigoFicha
      },
      evaluado: {
        codigoFicha: this.DataToShow.registros.evaluado.codigoFicha
      },
      codCalendario: this.CalendarCode,
      detalles: []
    };
  

    if(this.EvaluadoVaARegistrar){
      
      if(this.PidDetail1){
        if (!this.Item1ComplianceAcomplishDate || !this.Item1ComplianceAcomplishPercentage || !this.Commentary1 || !this.IsItem1Attached){
        this.IsSavingProgress = true;
        this.Items1BorderRed = true;
      } else {
        this.IsSavingProgress = false;
      }

      if(this.Item1ComplianceAcomplishDate){
        if(this.CompareStartAndExecutionDate(this.Item1StartDate,this.Item1ComplianceAcomplishDate)){
          this.Items1BorderRed = true;
          return Swal.fire('Advertencia','La fecha de ejecución no puede ser menor a la fecha de inicio de iniciativa.','warning')
        }
      }
 
        let Nivel1BodyCompletado: any = {
          idPidDetalle: this.DataToShow.registros.detalles[0].idPidDetalle,
          orden: 1,
          competencia: {
            codigo: this.CompetenciaSeleccionada,
            titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
          },
          objetivoDesarrollo: this.ObjetivoDesarrollo,
          iniciativaAcciones: this.IniciativaYMejora1,
          codigosIndicadores: [parseInt(this.selectedIndicatorItem1)],
          codigosEntregables: [parseInt(this.selectedDeliverableItem1)],
          fechaInicioIniciativa: this.DataToShow.registros.detalles[0].fechaInicioIniciativa,
          fechaFinIniciativa: this.DataToShow.registros.detalles[0].fechaFinIniciativa,
          fechaEjecucion: this.Item1ComplianceAcomplishDate === undefined || this.Item1ComplianceAcomplishDate === "" ? null : this.Item1ComplianceAcomplishDate,
          cumplimiento: this.Item1ComplianceAcomplishPercentage === undefined || this.Item1ComplianceAcomplishPercentage === "" ? 0 : this.Item1ComplianceAcomplishPercentage, 
          comentario: this.Commentary1
        };

        if (this.PidDetail1) {
          BodyToSend.detalles.unshift(Nivel1BodyCompletado);
        }
      } 

      if(this.PidDetail2){
        if (!this.Item2ComplianceAcomplishDate || !this.Item2ComplianceAcomplishPercentage || !this.Commentary2 || !this.IsItem2Attached){
        this.IsSavingProgress = true;
        this.Items2BorderRed = true;
      } else {
        //this.IsSavingProgress = false;
      }
      if(this.Item2ComplianceAcomplishDate){
        if(this.CompareStartAndExecutionDate(this.Item2StartDate,this.Item2ComplianceAcomplishDate)){
          this.Items2BorderRed = true;
          return Swal.fire('Advertencia','La fecha de ejecución no puede ser menor a la fecha de inicio de iniciativa.','warning')
        }
       }

      let Nivel2BodyCompletado: any = {
          idPidDetalle: this.DataToShow.registros.detalles[1].idPidDetalle,
          orden: 2,
          competencia: {
            codigo: this.CompetenciaSeleccionada,
            titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
          },
          objetivoDesarrollo: this.ObjetivoDesarrollo,
          iniciativaAcciones: this.IniciativaYMejora2,
          codigosIndicadores: [parseInt(this.selectedIndicatorItem2)],
          codigosEntregables: [parseInt(this.selectedDeliverableItem2)],
          fechaInicioIniciativa: this.DataToShow.registros.detalles[1].fechaInicioIniciativa,
          fechaFinIniciativa: this.DataToShow.registros.detalles[1].fechaFinIniciativa,
          fechaEjecucion: this.Item2ComplianceAcomplishDate === undefined || this.Item2ComplianceAcomplishDate === "" ? null : this.Item2ComplianceAcomplishDate,
          cumplimiento: this.Item2ComplianceAcomplishPercentage === undefined || this.Item2ComplianceAcomplishPercentage === "" ? 0 : this.Item2ComplianceAcomplishPercentage, 
          comentario: this.Commentary2
        };

        BodyToSend.detalles.splice(2, 0, Nivel2BodyCompletado);
      }

      if(this.PidDetail3){
        if (!this.Item3ComplianceAcomplishDate || !this.Item3ComplianceAcomplishPercentage || !this.Commentary3 || !this.IsItem3Attached){
        this.IsSavingProgress = true;
        this.Items3BorderRed = true;
      } else {
        //this.IsSavingProgress = false;
      }

      if(this.Item3ComplianceAcomplishDate){
        if(this.CompareStartAndExecutionDate(this.Item3StartDate,this.Item3ComplianceAcomplishDate)){
          this.Items3BorderRed = true;
          return Swal.fire('Advertencia','La fecha de ejecución no puede ser menor a la fecha de inicio de iniciativa.','warning')
        }
      }

      let Nivel3BodyCompletado: any = {
        idPidDetalle: this.DataToShow.registros.detalles[2].idPidDetalle,
        orden: 3,
        competencia: {
          codigo: this.CompetenciaSeleccionada,
          titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
        },
        objetivoDesarrollo: this.ObjetivoDesarrollo,
        iniciativaAcciones: this.IniciativaYMejora3,
        codigosIndicadores: [parseInt(this.selectedIndicatorItem3)],
        codigosEntregables: [parseInt(this.selectedDeliverableItem3)],
        fechaInicioIniciativa: this.DataToShow.registros.detalles[2].fechaInicioIniciativa,
        fechaFinIniciativa: this.DataToShow.registros.detalles[2].fechaFinIniciativa,
        fechaEjecucion: this.Item3ComplianceAcomplishDate === undefined || this.Item3ComplianceAcomplishDate === "" ? null : this.Item3ComplianceAcomplishDate,
        cumplimiento: this.Item3ComplianceAcomplishPercentage === undefined || this.Item3ComplianceAcomplishPercentage === "" ? 0 : this.Item3ComplianceAcomplishPercentage, 
        comentario: this.Commentary3
      };

        BodyToSend.detalles.splice(3, 0, Nivel3BodyCompletado);
      } 
    }

    if(this.Rechazado && this.EvaluadoVaAActualizar){

      if(this.PidDetail1){
        if (!this.Item1ComplianceAcomplishDate || !this.Item1ComplianceAcomplishPercentage || !this.Commentary1  || this.AttachedItem1Label === "Adjuntar"){
        this.IsSavingProgress = true;
        this.Items1BorderRed = true;
      } else {
        this.IsSavingProgress = false;
      }

      if(this.Item1ComplianceAcomplishDate){
        if(this.CompareStartAndExecutionDate(this.Item1StartDate,this.Item1ComplianceAcomplishDate)){
          this.Items1BorderRed = true;
          return Swal.fire('Advertencia','La fecha de ejecución no puede ser menor a la fecha de inicio de iniciativa.','warning')
        }
      }

        let Nivel1BodyCompletado: any = {
          idPidDetalle: this.DataToShow.registros.detalles[0].idPidDetalle,
          orden: 1,
          competencia: {
            codigo: this.CompetenciaSeleccionada,
            titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
          },
          objetivoDesarrollo: this.ObjetivoDesarrollo,
          iniciativaAcciones: this.IniciativaYMejora1,
          codigosIndicadores: [parseInt(this.selectedIndicatorItem1)],
          codigosEntregables: [parseInt(this.selectedDeliverableItem1)],
          fechaInicioIniciativa: this.DataToShow.registros.detalles[0].fechaInicioIniciativa,
          fechaFinIniciativa: this.DataToShow.registros.detalles[0].fechaFinIniciativa,
          fechaEjecucion: this.Item1ComplianceAcomplishDate === undefined || this.Item1ComplianceAcomplishDate === "" ? null : this.Item1ComplianceAcomplishDate,
          cumplimiento: this.Item1ComplianceAcomplishPercentage === undefined || this.Item1ComplianceAcomplishPercentage === "" ? 0 : this.Item1ComplianceAcomplishPercentage, 
          comentario: this.Commentary1
        };

        if (this.PidDetail1) {
          BodyToSend.detalles.unshift(Nivel1BodyCompletado);

        }
      }

      if(this.PidDetail2){
        if (!this.Item2ComplianceAcomplishDate || !this.Item2ComplianceAcomplishPercentage || !this.Commentary2  || this.AttachedItem2Label === "Adjuntar"){
          this.IsSavingProgress = true;
          this.Items2BorderRed = true;
        } else {
         // this.IsSavingProgress = false;
        }

        if(this.Item2ComplianceAcomplishDate){
          if(this.CompareStartAndExecutionDate(this.Item2StartDate,this.Item2ComplianceAcomplishDate)){
            this.Items2BorderRed = true;
            return Swal.fire('Advertencia','La fecha de ejecución no puede ser menor a la fecha de inicio de iniciativa.','warning')
          }
        }
    

      let Nivel2BodyCompletado: any = {
          idPidDetalle: this.DataToShow.registros.detalles[1].idPidDetalle,
          orden: 2,
          competencia: {
            codigo: this.CompetenciaSeleccionada,
            titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
          },
          objetivoDesarrollo: this.ObjetivoDesarrollo,
          iniciativaAcciones: this.IniciativaYMejora2,
          codigosIndicadores: [parseInt(this.selectedIndicatorItem2)],
          codigosEntregables: [parseInt(this.selectedDeliverableItem2)],
          fechaInicioIniciativa: this.DataToShow.registros.detalles[1].fechaInicioIniciativa,
          fechaFinIniciativa: this.DataToShow.registros.detalles[1].fechaFinIniciativa,
          fechaEjecucion: this.Item2ComplianceAcomplishDate === undefined || this.Item2ComplianceAcomplishDate === "" ? null : this.Item2ComplianceAcomplishDate,
          cumplimiento: this.Item2ComplianceAcomplishPercentage === undefined || this.Item2ComplianceAcomplishPercentage === "" ? 0 : this.Item2ComplianceAcomplishPercentage, 
          comentario: this.Commentary2
        };

        BodyToSend.detalles.splice(2, 0, Nivel2BodyCompletado);
      }

      if(this.PidDetail3){
        if (!this.Item3ComplianceAcomplishDate || !this.Item3ComplianceAcomplishPercentage || !this.Commentary3 || this.AttachedItem3Label === "Adjuntar"){
          ////console.log(this.Item3ComplianceAcomplishDate)
          ////console.log(this.Item3ComplianceAcomplishPercentage)
          ////console.log(this.Commentary3)
        this.IsSavingProgress = true;
        this.Items3BorderRed = true;
      } else {
        //this.IsSavingProgress = false;
      }
      if(this.Item2ComplianceAcomplishDate){
        if(this.CompareStartAndExecutionDate(this.Item3StartDate,this.Item3ComplianceAcomplishDate)){
          this.Items3BorderRed = true;
          return Swal.fire('Advertencia','La fecha de ejecución no puede ser menor a la fecha de inicio de iniciativa.','warning')
        }
      }

      let Nivel3BodyCompletado: any = {
        idPidDetalle: this.DataToShow.registros.detalles[2].idPidDetalle,
        orden: 3,
        competencia: {
          codigo: this.CompetenciaSeleccionada,
          titulo: this.GetCompetencyName(this.CompetenciaSeleccionada)
        },
        objetivoDesarrollo: this.ObjetivoDesarrollo,
        iniciativaAcciones: this.IniciativaYMejora3,
        codigosIndicadores: [parseInt(this.selectedIndicatorItem3)],
        codigosEntregables: [parseInt(this.selectedDeliverableItem3)],
        fechaInicioIniciativa: this.DataToShow.registros.detalles[2].fechaInicioIniciativa,
        fechaFinIniciativa: this.DataToShow.registros.detalles[2].fechaFinIniciativa,
        fechaEjecucion: this.Item3ComplianceAcomplishDate === undefined || this.Item3ComplianceAcomplishDate === "" ? null : this.Item3ComplianceAcomplishDate,
        cumplimiento: this.Item3ComplianceAcomplishPercentage === undefined || this.Item3ComplianceAcomplishPercentage === "" ? 0 : this.Item3ComplianceAcomplishPercentage, 
        comentario: this.Commentary3
      };

        BodyToSend.detalles.splice(3, 0, Nivel3BodyCompletado);
      }
    } 
  


let text: string = update ? 'la actualización' : 'el registro';
let Progress: string = this.IsSavingProgress ? "¿Estás seguro de que deseas guardar el progreso de tu cumplimiento de PID?" : `¿Estás seguro de que deseas finalizar ${text} de tu cumplimiento de PID?`
let textCapitalized: string = update ? 'Actualizar' : 'Registrar';
let finishedText = update ? 'actualizado' : 'registrado';
let finishedtextCapitalized: string = "Guardar"
let finishedtextProgress: string = "guardado"

Swal.fire({
  title: "Aviso",
  text: Progress,
  type: 'warning',
  showCancelButton: true,
  confirmButtonText: this.IsSavingProgress? finishedtextCapitalized : textCapitalized,
  cancelButtonText: "Cancelar"
}).then((result) => {
  if (result.value) {
    this.utilService.showLoading();

    const requests = [];  // Arreglo de requests PUT
    let hasDifferentItem = false; // Indicador para verificar si al menos un item es diferente
    
    // Verificar si al menos uno de los tres primeros ítems no es igual a su respectivo AttachedItem
    for (let item of this.DataToShow.registros.detalles) {
      if (item.orden === 1 && this.Item1AttachedItem && item !== this.Item1AttachedItem) {
        hasDifferentItem = true;
      }
      if (item.orden === 2 && this.Item2AttachedItem && item !== this.Item2AttachedItem) {
        hasDifferentItem = true;
      }
      if (item.orden === 3 && this.Item3AttachedItem && item !== this.Item3AttachedItem) {
        hasDifferentItem = true;
      }
    }
    
    // Si al menos un item es diferente, realizar los PUT requests
    if (hasDifferentItem) {
      // Genera los observables de los PUT requests para cada detalle
      for (let item of this.DataToShow.registros.detalles) {
        if (item.orden === 1 && this.Item1AttachedItem && item !== this.Item1AttachedItem) {
          requests.push(
            this.pidService.PutEvaluatedComplianceUploadFile(item.idPidDetalle, this.Item1AttachedItem)
          );
        } else {
          ////console.log('No se actualizó el documento N1');
        }
        if (item.orden === 2 && this.Item2AttachedItem && item !== this.Item2AttachedItem) {
          requests.push(
            this.pidService.PutEvaluatedComplianceUploadFile(item.idPidDetalle, this.Item2AttachedItem)
          );
        } else {
          ////console.log('No se actualizó el documento N2');
        }
        if (item.orden === 3 && this.Item3AttachedItem && item !== this.Item3AttachedItem) {
          requests.push(
            this.pidService.PutEvaluatedComplianceUploadFile(item.idPidDetalle, this.Item3AttachedItem)
          );
        } else {
          ////console.log('No se actualizó el documento N3');
        }
      }
    
           // Ejecuta todos los requests PUT en paralelo y espera a que terminen
           forkJoin(requests).subscribe({
            next: (responses) => {
              ////console.log('Todos los archivos subidos con éxito', responses);
              ////console.log(BodyToSend)
              this.utilService.showLoading();
              this.pidService.SavePidForEvaluated(
                this.DataToShow.registros.evaluador.codigoFicha,
                this.DataToShow.registros.evaluado.codigoFicha,
                this.CalendarCode,
                BodyToSend
              ).subscribe({
                next: (data) => {
                  Swal.fire({
                    title: `Cumplimiento de PID ${this.IsSavingProgress? finishedtextProgress : finishedText}`,
                    text: `Tu cumplimiento de PID fue ${this.IsSavingProgress? finishedtextProgress : finishedText} con éxito.`,
                    type: 'success',
                    confirmButtonText: 'OK'
                  }).then(() => {
                    window.location.reload();
                  });
                },
                error: (error) => {
                  Swal.fire({
                    title: "Ocurrió un error :(",
                    text: error.message,
                    type: 'error',
                    confirmButtonText: 'OK'
                  });
                }
              });
            },
            error: (error) => {
              console.error('Error en la subida de archivos', error);
              if (error.status === 400) {
                ////console.log('status400');
                let mensaje = error.error.mensaje;
                Swal.fire({
                  title: "Ocurrió un error al subir los archivos.",
                  text: mensaje,
                  type: 'error',
                  confirmButtonText: 'OK'
                });
              } else {
                Swal.fire({
                  title: "Ocurrió un error al subir los archivos.",
                  type: 'error',
                  confirmButtonText: 'OK'
                });
              }
            }
          });
        } else {
          // Si todos los ítems son iguales, se va directamente al SavePidForEvaluated
          this.pidService.SavePidForEvaluated(
            this.DataToShow.registros.evaluador.codigoFicha,
            this.DataToShow.registros.evaluado.codigoFicha,
            this.CalendarCode,
            BodyToSend
          ).subscribe({
            next: (data) => {
              Swal.fire({
                title: `Cumplimiento de PID ${this.IsSavingProgress? finishedtextProgress : finishedText}`,
                text: `Tu cumplimiento de PID fue ${this.IsSavingProgress? finishedtextProgress : finishedText} con éxito.`,
                type: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                window.location.reload();
              });
            },
            error: (error) => {
              Swal.fire({
                title: "Ocurrió un error :(",
                text: error.message,
                type: 'error',
                confirmButtonText: 'OK'
              });
            }
          });
        }
        
      }
    });  
  }
  
  onTextChange1ObjetivoDesarrollo(newText: string): void {
    this.ObjetivoDesarrollo = newText;
  }

  onTextChangeComentarios(newText: string, position: number): void {
    newText = newText.trim(); // Elimina espacios en blanco
    ////console.log('Antes Comentary 1: '+ this.Commentary1)
    ////console.log('Antes Comentary 3: '+ this.Commentary3)
    // Si el nuevo texto es igual al valor actual, no lo actualizamos
    if (position === 1 && this.Commentary1 !== newText) {
        ////console.log("Actualizando Commentary1:", newText);
        this.Commentary1 = newText;
    } else if (position === 2 && this.Commentary2 !== newText) {
        ////console.log("Actualizando Commentary2:", newText);
        this.Commentary2 = newText;
    } else if (position === 3 && this.Commentary3 !== newText) {
        ////console.log("Actualizando Commentary3:", newText);
        this.Commentary3 = newText;
    }
  }

  FormatDate(dateString: string): string {
    if(dateString != undefined){
      return this.utilService.GetFormatedDate(dateString)
    }
  }

  showOptions(containerNumber: number) {
      if(containerNumber === 1){
        this.activeContainer1 = true;
        this.activeContainer2 = false;
        this.activeContainer3 = false;
      }else if(containerNumber === 2){
        this.activeContainer1 = false;
        this.activeContainer2 = true;
        this.activeContainer3 = false;
      }else if(containerNumber === 3){
        this.activeContainer1 = false;
        this.activeContainer2 = false;
        this.activeContainer3 = true;
      }else{

      }
  }

  hideOptions() {
      this.activeContainer1 = false;
      this.activeContainer2 = false;
      this.activeContainer3 = false;
  }
}
