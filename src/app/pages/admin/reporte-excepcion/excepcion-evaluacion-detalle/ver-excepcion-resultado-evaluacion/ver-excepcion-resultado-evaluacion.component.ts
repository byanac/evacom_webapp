import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-ver-excepcion-resultado-evaluacion',
  templateUrl: './ver-excepcion-resultado-evaluacion.component.html',
  styleUrls: ['./ver-excepcion-resultado-evaluacion.component.css']
})
export class VerExcepcionResultadoEvaluacionComponent implements OnInit {
  CodWorkerFile: string = this.route.snapshot.paramMap.get('CodWorkerFile');
  CodWorkerPosition: string = this.route.snapshot.paramMap.get('CodWorkerPosition');
  CodEvaluatorFile: string = this.route.snapshot.paramMap.get('CodEvaluatorFile');
  CodEvaluatorPosition: string = this.route.snapshot.paramMap.get('CodEvaluatorPosition');
  CodCalendar: string = this.route.snapshot.paramMap.get('CodCalendar');
  TableData: IAutoEvaluationResult
  AutoEvaluationResult: number;
  DataFromsessionStorage:ILoginData;

  constructor(
    private peopletobeevaluatedService: PeopletobeevaluatedService,
    private route: ActivatedRoute,
    private utilsService: UtilsService
  ){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
    let response: IAutoEvaluationResult 
    
    ////console.log(this.CodWorkerFile);
    ////console.log(this.CodWorkerPosition)
    ////console.log(this.CodEvaluatorFile)
    ////console.log(this.CodEvaluatorPosition)

    response = await ((this.peopletobeevaluatedService.GetWorkerData(this.CodWorkerFile,this.CodWorkerPosition,this.CodEvaluatorFile,this.CodEvaluatorPosition,this.CodCalendar)).toPromise());

    this.AutoEvaluationResult = response.registros.resultado
    this.TableData = response;
    ////console.log(this.TableData)
    this.utilsService.closeLoading();
  }

  PrintButton(){
    window.print();
  }

  calcularPromedioPonderado(resultado): string {
    let result = (resultado / 5) * 100;
    let message: string;
    message = result.toFixed(2) + "%";
    return message;
  }

ObtenerLabeldeEstado(resultado: number): string {
  let result = (resultado / 5) * 100;
  let message: string;

  switch (true) {
      case (result >= 50 && result <= 75):
          message = "EN DESARROLLO";
          break;
      case (result >= 0 && result <= 49):
          message = "NO CUMPLE";
          break;
      case (result >= 75 && result <= 94):
          message = "EFECTIVO";
          break;
      default:
          message = "ALTAMENTE EFECTIVO";
          break;
  }
  return message;
}

obtenerNombreCompetenciasFiltrada(value: string): string {
  //////console.log(value)
 if(this.TableData.registros.competenciaFortaleza === "" || this.TableData.registros.competenciaOportunidad === ""){
     return "-No se encontró el título de la competencia seleccionada-"
   }
   else{
     let returnedValue = this.TableData.registros.competenciasResultado.filter(item => item.codigo === value);
     return returnedValue[0].titulo + ":"
   }
 }

calcularPromedioFinal(resultado: number): string {
  let result = (resultado / 5) * 100
  return(result.toFixed(2))
}

removeLeadingZeros(value: string | number): string {
  const input = value.toString();
  return input.replace(/^0+/, '');
}

}
