import { Component, Input, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() Data: IAutoEvaluationResult;
  @Input() AutoEvaluationResult: number;
  Result: number;

  constructor(){}

  ngOnInit(): void {
    this.Result = this.Data.registros.resultado
    //////console.log(this.Result)
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

ObtenerLabeldeEstado(resultado: number) {
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