import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { IFeedback180EvaluationResults } from 'src/app/interfaces/IFeedback180EvaluationResults';
import { IFeedback90EvaluationResults } from 'src/app/interfaces/IFeedback90EvaluationResults';
import { IFeedbackStatus } from 'src/app/interfaces/IFeedbackStatus';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ISendFeedback } from 'src/app/interfaces/ISendEvaluatedFeedback';
import { LoginService } from 'src/app/services/auth/login.service';
import { AutoevaluationService } from 'src/app/services/autoevaluation/autoevaluation.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { FeedbackService } from 'src/app/services/feedback/feedback.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-registro-retroalimentacion',
  templateUrl: './registro-retroalimentacion.component.html',
  styleUrls: ['./registro-retroalimentacion.component.css']
})
export class RegistroRetroalimentacionComponent implements OnInit {
  DataFromsessionStorage:ILoginData = this.loginservice.GetUserSession();
  Type: string = ""
  FeedbackID: string = ""
  FichaEvaluado: string = ""
  CodCalendario: string = this.loginService.GetEvaluatedCalendarCode();
  TipoCalendario: string = this.loginService.GetEvaluatedCalendarType();
  ShowEvaluatorTextField: boolean = false;
  ShowEvaluatedTextField: boolean = false;
  DisableEvaluatorTextField: boolean = false;
  DisableEvaluatedTextField: boolean = false;
  ShowEvaluatorSubmitButton: boolean = false;
  ShowEvaluatedSubmitButton: boolean = false;
  DisableSubmitButton: boolean = false;
  SubmitEvaluatedFeedback:boolean = false;
  SubmitEvaluatorFeedback:boolean = false;
  DataToShow: IFeedback90EvaluationResults | IFeedback180EvaluationResults
  EvaluatorFeedbackText: string = ""
  EvaluatedFeedbackText: string = ""
  AutoEvaluationResponse: IAutoEvaluationResult
  AutoEvaluationResult:number = 0;
  EvaluatorResponse90: any;
  EvaluatorEvaluationResult: number = 0
  FeedbackStatus: IFeedbackStatus
  EvaluationID: number
  PeriodName: string = ""
  UnfinishedEvaluatorEvaluation = false;
  Show90: boolean = false;
  Show180: boolean = false;
  CalendarTypeNumber: string = ""

  constructor(private loginservice: LoginService, private router: Router, private calendarService: CalendarService, private feedbackService: FeedbackService, private utilService: UtilsService, private loginService: LoginService, private autoevaluationService: AutoevaluationService){}

  async ngOnInit(): Promise<void | SweetAlertResult> {
    this.utilService.showLoading();
    
    this.calendarService.GetCalendarName(this.CodCalendario).then(result => {
      this.PeriodName = result;
    });

    this.calendarService.GetCalendarTypeNumber(this.CodCalendario).then(result => {
      this.CalendarTypeNumber = result;
    });

    if (this.DataFromsessionStorage.permisos[0].evaluado || this.DataFromsessionStorage.permisos[1].evaluado) {
      if(this.TipoCalendario === '90'){
        this.MainLoadEvaluated90()
      }else if(this.TipoCalendario === '180'){
        this.MainLoadEvaluated180();
      }
    } else {
        Swal.fire("Alerta", "No eres un evaluado, serás devuelto a la página de inicio se sesión", "warning").then(() => {
            this.router.navigateByUrl('/home');
        });
    }
}


  async MainLoadEvaluated90(): Promise<void | SweetAlertResult>{
      const { ficha, codPuesto } = this.DataFromsessionStorage;

      const response: any = await this.feedbackService.GetEvaluationGlobal90FromWorker(ficha, this.CodCalendario).toPromise();
      this.DataToShow = response.registros;
     //////console.log('Global90: ', this.DataToShow)

      let EvaluationIDResponse = await this.feedbackService.GetFeedbackEvaluationID(ficha,codPuesto,this.CodCalendario).toPromise();
      this.EvaluationID = EvaluationIDResponse.registros

      this.FeedbackStatus = await this.feedbackService.GetFeedbackStatus(this.EvaluationID).toPromise();
      //////console.log('FeedbackStatus: ', this.FeedbackStatus)

      if(this.FeedbackStatus.registros.estadoEvaluador){
        this.Show90 = true;
        this.processAutoEvaluationAndEvaluationData();
        this.handleFeedbackStatus();
   
      }else{
        this.Show90 = true;
        this.processAutoEvaluationAndEvaluationData();
        this.handleFeedbackStatus();
        this.handleUnfinishedFeedbackForChiefEvaluator();
      }
  }

  async MainLoadEvaluated180(): Promise<void | SweetAlertResult>{
    const { ficha, codPuesto } = this.DataFromsessionStorage;

    const response: any = await this.feedbackService.GetEvaluationGlobal180FromWorker(ficha, this.CodCalendario).toPromise();
    this.DataToShow = response.registros;
   //////console.log('Global90: ', this.DataToShow)

    let EvaluationIDResponse = await this.feedbackService.GetFeedbackEvaluationID(ficha,codPuesto,this.CodCalendario).toPromise();
    this.EvaluationID = EvaluationIDResponse.registros

    this.FeedbackStatus = await this.feedbackService.GetFeedbackStatus(this.EvaluationID).toPromise();
    //////console.log('FeedbackStatus: ', this.FeedbackStatus)

    if(this.FeedbackStatus.registros.estadoEvaluador){
      this.Show180 = true;
      this.processAutoEvaluationAndEvaluationData180();
      return this.handleFeedbackStatus();
 
    }else{
      this.Show180 = true;
      this.processAutoEvaluationAndEvaluationData180();
      this.handleFeedbackStatus();
      this.handleUnfinishedFeedbackForChiefEvaluator();
    }
}

  private handleFeedbackStatus(): void {
      const { registros } = this.FeedbackStatus;

      this.ShowEvaluatedTextField = true;
      this.DisableEvaluatorTextField = true;
      this.ShowEvaluatorTextField = true;
      this.EvaluatorFeedbackText = registros.comentarioEvaluador;

      if (registros.estadoEvaluador && registros.estadoEvaluado) {
          this.DisableEvaluatedTextField = true;
          this.DisableSubmitButton = true;
          this.EvaluatedFeedbackText = registros.comentarioEvaluado;
      } else {
          this.DisableEvaluatedTextField = false;
          this.DisableSubmitButton = false;
          this.SubmitEvaluatedFeedback = true;
      }
  }

  private processAutoEvaluationAndEvaluationData(): void {
      const AutoEvaluationData: IFeedback90EvaluationResults | IFeedback180EvaluationResults = this.DataToShow;
      this.AutoEvaluationResult = AutoEvaluationData.promedioAutoevaluacion

      ////console.log(AutoEvaluationData)
      if (AutoEvaluationData.competencia) {
        this.chartLabelsEvaluators.push('Autoevaluación')
        this.chartLabelsEvaluators.push('Jefe directo')
        AutoEvaluationData.competencia.forEach((item: any) => {
              this.chartLabels.push(item.titulo);
              this.chartLabels3.push(item.titulo);
              this.chartData[0].data.push(item.promedioAuto);
              this.chartData[1].data.push(75);
              this.chartData3[0].data.push(item.promedioAuto);
              this.chartData3[1].data.push(item.promedio);
              this.chartData3[2].data.push(75);
          });
      }

      if (AutoEvaluationData) {
          this.chartDataEvaluators[0].data.push(AutoEvaluationData.promedioAutoevaluacion);
          if('promedioEvaluacion' in AutoEvaluationData){
            this.chartDataEvaluators[0].data.push(AutoEvaluationData.promedioEvaluacion);
          }
          this.chartDataEvaluators[1].data.push(75);
          this.chartDataEvaluators[1].data.push(75);
          this.chartData3[0].data.push(AutoEvaluationData.promedioAutoevaluacion);
      }
      this.utilService.closeLoading();
  }

  private processAutoEvaluationAndEvaluationData180(): void {
    const AutoEvaluationData = this.DataToShow;
    this.AutoEvaluationResult = AutoEvaluationData.promedioAutoevaluacion

    ////console.log(AutoEvaluationData)
    if (AutoEvaluationData.competencia) {
      this.chartLabelsEvaluators.push('Autoevaluación')
      this.chartLabelsEvaluators.push('Jefe directo')
      this.chartLabelsEvaluators.push('Trabajadores')
      this.chartLabelsEvaluators.push('Resultado global desempeño')
      AutoEvaluationData.competencia.forEach((item: any) => {
            this.chartLabels.push(item.titulo);
            this.chartLabels3.push(item.titulo);
            this.chartData[0].data.push(item.promedioAuto);
            this.chartData[1].data.push(75);
            this.chartData3180[0].data.push(item.promedioAuto);
            this.chartData3180[1].data.push(item.promedio);
            this.chartData3180[2].data.push(item.promedioSubalternos);
            this.chartData3180[3].data.push(item.promedioFinal);
            this.chartData3180[4].data.push(75);
        });
    }

    if (AutoEvaluationData) {
        this.chartDataEvaluators[0].data.push(AutoEvaluationData.promedioAutoevaluacion);
        if ('promedioJefe' in AutoEvaluationData && 'promedioSubalternos' in AutoEvaluationData && 'promedioFinal' in AutoEvaluationData) {
          this.chartDataEvaluators[0].data.push((AutoEvaluationData as IFeedback180EvaluationResults).promedioJefe);
          this.chartDataEvaluators[0].data.push((AutoEvaluationData as IFeedback180EvaluationResults).promedioSubalternos);
          this.chartDataEvaluators[0].data.push((AutoEvaluationData as IFeedback180EvaluationResults).promedioFinal);
        }
        this.chartDataEvaluators[1].data.push(75);
        this.chartDataEvaluators[1].data.push(75);
        this.chartDataEvaluators[1].data.push(75);
        this.chartDataEvaluators[1].data.push(75);
        this.chartData3[0].data.push(AutoEvaluationData.promedioAutoevaluacion);
    }
    this.utilService.closeLoading();
}

  private handleUnfinishedAutoEvaluation(): Promise<void | SweetAlertResult> {
      return Swal.fire("Autoevaluación no finalizada", "La autoevaluación no fue finalizada.", "warning").then(() => {
          this.router.navigateByUrl('/home');
      });
  }

  private handleUnfinishedEvaluation(): Promise<void | SweetAlertResult> {
      return Swal.fire("Evaluación no finalizada", "La evaluación por parte del evaluador no fue finalizada.", "warning").then(() => {
        this.router.navigateByUrl('/home');
    });
  }

  private handleUnfinishedFeedbackForChiefEvaluator(): Promise<void | SweetAlertResult> {
    this.UnfinishedEvaluatorEvaluation = true;
    return Swal.fire("Retroalimentación del evaluador no finalizada", "La retroalimentación de tu evaluador jefe no fue finalizada.", "warning")
  }

  private RegisterFeedback(): void | Promise<SweetAlertResult>{
    if(this.EvaluatedFeedbackText.trim() === ""){
      return Swal.fire('Advertencia', 'Por favor, ingresa tu retroalimentación antes de continuar.','warning');
    }

    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de registrar la retroalimentación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
          this.utilService.showLoading()
          let BodyToPost:ISendFeedback = 
            {
              idEvaluacion: this.EvaluationID,
              mensaje : this.EvaluatedFeedbackText
            }
          //////////console.log(BodyToPost)
          this.feedbackService.PostEvaluatedSaveFeedback(BodyToPost).subscribe({
            next: (data) => {
              Swal.fire("Retroalimentación registrado","La retroalimentación fue registrado con éxito.","success").then(() => {
                window.location.reload();
              })
              //////////console.log(data)
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al enviar la evaluación.",'',"error");
            }
          }); 
      }
    })
  }

  private AutoevaluacionObtenerNombreCompetenciasFiltrada(value: string): string {
    ////////////console.log(value)
    if(this.AutoEvaluationResponse.registros.competenciaFortaleza === "" || this.AutoEvaluationResponse.registros.competenciaOportunidad === ""){
      return "-No se encontró el título de la competencia seleccionada-"
    }
    else{
      let returnedValue = this.AutoEvaluationResponse.registros.competenciasResultado.filter(item => item.codigo === value);
      return returnedValue[0].titulo + ":"
    }
  }

  private EvaluadorEvaluacion90ObtenerNombreCompetenciasFiltrada(value: string): string {
      let returnedValue = this.EvaluatorResponse90.registros.competenciasResultado.filter(item => item.codigo === value);
      return returnedValue[0].titulo + ":"
  }

  private ObtenerLabeldeEstado(resultado: number) {
    let message: string;
  
    switch (true) {
        case (resultado >= 50 && resultado <= 75):
            message = "EN DESARROLLO";
            break;
        case (resultado >= 0 && resultado <= 49):
            message = "NO CUMPLE";
            break;
        case (resultado >= 75 && resultado <= 94):
            message = "EFECTIVO";
            break;
        default:
            message = "ALTAMENTE EFECTIVO";
            break;
    }
    return message;
  }

  CalcGlobalResult(ChiefScore: number, EvaluatorsScore: number): number{
    return parseFloat(((ChiefScore * 0.7) + (EvaluatorsScore * 0.3)).toFixed(2));
  }

  //Gráfico de autoevaluación
  public chartOptions: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          max: 100
        }
      }]
    },
    legend: {
      position: 'bottom' // Cambia la posición de la leyenda a la parte inferior
  }};
  public chartLabels: string[] = [];
  public chartData: Array<any> = [
    { 
      data: [], 
      label: 'Nivel alcanzado por Competencia', 
      type: 'bar',
      backgroundColor: 'green'
    },
    { 
      data: [], 
      label: 'Nivel esperado', 
      type: 'line',
      borderColor: 'blue',
      fill: false,
    }
  ];

  //Gráfico por jefe evaluados/subordinados
  public chartLabelsEvaluators: string[] = [

  ];
  public chartDataEvaluators: Array<any> = [
    { 
      data: [], 
      label: 'Resultado global por evaluador', 
      type: 'bar',
      backgroundColor: 'purple'
    },
    { 
      data: [], 
      label: 'Nivel esperado', 
      type: 'line',
      borderColor: 'blue',
      fill: false,
    }
  ];
  public chartLegend: boolean = true;
  public chartType: string = 'bar';
  public chartColors: Array<any> = [
    { // verde para las barras
      backgroundColor: 'rgba(0, 128, 0, 0.7)',
      borderColor: 'rgba(0, 128, 0, 1)',      // Borde para la barra (sombra simulada)
      borderWidth: 4,                          // Grosor del borde (ajústalo para mayor efecto)
      hoverBackgroundColor: 'rgba(0, 128, 0, 0.9)', // Color al pasar el mouse
      hoverBorderColor: 'rgba(0, 100, 0, 1)'        // Sombra al pasar el mouse
    },
    { // azul para la línea
      borderColor: 'rgba(0, 0, 255, 0.7)',
      pointBackgroundColor: 'rgba(0, 0, 255, 0.7)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 0, 255, 0.7)'
    }
  ];
  public chartColorsEvaluators: Array<any> = [
    { // verde para las barras
      backgroundColor: 'rgba(255, 140, 0, 0.5)',  // Naranja oscuro con 80% opacidad
      borderColor: 'rgba(255, 140, 0, 0.8)',      // Borde para la barra (sombra simulada)
      borderWidth: 4,                             // Grosor del borde (ajústalo para mayor efecto)
      hoverBackgroundColor: 'rgba(255, 120, 0, 0.7)', // Color al pasar el mouse con 80% opacidad
      hoverBorderColor: 'rgba(255, 140, 0, 0.8)'     // Sombra al pasar el mouse        
    },
    { // azul para la línea
      borderColor: 'rgba(0, 0, 255, 0.7)',
      pointBackgroundColor: 'rgba(0, 0, 255, 0.7)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0, 0, 255, 0.7)'
    }
  ];

  public chartOptions3: any = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          max: 100
        }
      }]
    },
    legend: {
      position: 'bottom' // Cambia la posición de la leyenda a la parte inferior
    }
  };

  public chartLabels3: string[] = [];

  public chartData3: Array<any> = [
    { 
      data: [], 
      label: 'Autoevaluación', 
      type: 'bar',
      backgroundColor: 'rgba(235,126,44,255)'
    },
    { 
      data: [], 
      label: 'Jefe directo', 
      type: 'bar',
      backgroundColor: 'yellow'
    },
    { 
      data: [], 
      label: 'Nivel esperado', 
      type: 'line',
      borderColor: 'blue',
      fill: false,
      pointBackgroundColor: 'blue',
      pointBorderColor: 'blue',
      pointHoverBackgroundColor: 'blue',
      pointHoverBorderColor: 'blue'
    }
  ];

  public chartData3180: Array<any> = [
    { 
      data: [], 
      label: 'Autoevaluación', 
      type: 'bar',
      backgroundColor: 'rgba(235,126,44,255)'
    },
    { 
      data: [], 
      label: 'Jefe directo', 
      type: 'bar',
      backgroundColor: 'yellow'
    },
    { 
      data: [], 
      label: 'Trabajadores', 
      type: 'bar',
      backgroundColor: 'yellow'
    },
    { 
      data: [], 
      label: 'Resultado Global por competencias', 
      type: 'bar',
      backgroundColor: 'yellow'
    },
    { 
      data: [], 
      label: 'Nivel esperado', 
      type: 'line',
      borderColor: 'blue',
      fill: false,
      pointBackgroundColor: 'blue',
      pointBorderColor: 'blue',
      pointHoverBackgroundColor: 'blue',
      pointHoverBorderColor: 'blue'
    }
  ];

  public chartLegend3: boolean = true;
  public chartType3: string = 'bar';
}