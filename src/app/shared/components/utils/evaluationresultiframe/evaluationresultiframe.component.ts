import { Component, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ActivatedRoute } from '@angular/router';
import { AutoevaluationService } from 'src/app/services/autoevaluation/autoevaluation.service';
import { UtilsService } from 'src/app/services/utils/utils.service';


@Component({
  selector: 'app-evaluationresultiframe',
  templateUrl: './evaluationresultiframe.component.html',
  styleUrls: ['./evaluationresultiframe.component.css']
})
export class EvaluationResultiframeComponent implements OnInit {
  Data: IAutoEvaluationResult;
  File: string;
  Position: string;
  Result: number;
  EvaluatedFile: string = this.route.snapshot.paramMap.get('EvaluatedFile');
  EvaluatedPosition: string = this.route.snapshot.paramMap.get('EvaluatedPosition');

  constructor(
    private GetEvaluationProgressionService: AutoevaluationService,  
    private utilsService: UtilsService,
    private route: ActivatedRoute
  ){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
    //console.log(this.EvaluatedFile)
    //console.log(this.EvaluatedPosition)
    const response: IAutoEvaluationResult = await ((this.GetEvaluationProgressionService.GetAutoEvalProgression(this.EvaluatedFile, this.EvaluatedPosition)).toPromise());
    this.Result = response.registros.resultado
    this.Data = response;
    this.utilsService.closeLoading();;
  }

  PrintButton(){
    window.print();
  }

  calcularPromedioPonderado(resultado) {
    let result = (resultado / 5) * 100;
    let message: string;
    message = result.toFixed(2) + "%";
    return message;
  }

  ObtenerLabeldeEstado(resultado) {
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
if(this.Data.registros.competenciaFortaleza === "" || this.Data.registros.competenciaOportunidad === ""){
    return "-No se encontró el título de la competencia seleccionada-"
  }
  else{
    let returnedValue = this.Data.registros.competenciasResultado.filter(item => item.codigo === value);
    return returnedValue[0].titulo + ":"
  }
}

calcularPromedioFinal(resultado: number) {
  let result = (resultado / 5) * 100
  return(result.toFixed(2))
}

removeLeadingZeros(value: string | number): string {
  const input = value.toString();
  return input.replace(/^0+/, '');
}
}
