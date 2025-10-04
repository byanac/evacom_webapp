import { Component, Input, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { LoginService } from 'src/app/services/auth/login.service';
import { AutoevaluationService } from 'src/app/services/autoevaluation/autoevaluation.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questionstablewithanswers',
  templateUrl: './questionstablewithanswers.component.html',
  styleUrls: ['./questionstablewithanswers.component.css']
})
export class QuestionstablewithanswersComponent implements OnInit {
  @Input() Data: IAutoEvaluationResult;
  DataFromsessionStorage?:ILoginData;
  CalendarCode:string = "";
  FortalezaNameValue: string = "";
  OportunidadNameValue: string = "";

  constructor(
    private AutoevaluationService: AutoevaluationService, 
    private utilsService: UtilsService
  ){}

  ngOnInit(): void {
    this.DataFromsessionStorage = JSON.parse(sessionStorage.getItem('userdata')!);
    this.CalendarCode = sessionStorage.getItem("vCodigo")
  }

  ReloadPage(): void{
    window.location.reload();
  }

  SaveButton(): any{
    if(this.Data.registros.competenciaOportunidad === this.Data.registros.competenciaFortaleza){
      return Swal.fire(
        'Competencias Duplicadas',
        'No es posible seleccionar las mismas competencias. Por favor, elige opciones diferentes para continuar.',
        'warning'
      );
    }

    Swal.fire({
      title:  "Aviso",
      text: "¿Estás seguro de que deseas guardar tu autoevaluación?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilsService.showLoading();
        //////console.log(this.Data)
        //////console.log(JSON.stringify(this.Data.registros))
              
        if(this.Data.registros.competenciaFortaleza === ""){
          this.Data.registros.fortaleza = '';
        }

        if(this.Data.registros.competenciaOportunidad === ""){
          this.Data.registros.oportunidad = '';
        }
        
        this.AutoevaluationService.PostAutoEvalProgression(this.Data.registros.calendario,this.DataFromsessionStorage.ficha, this.DataFromsessionStorage.codPuesto, this.Data.registros)
        .subscribe({
          next: (data) => {
            let message: string = "";
            data.registros.estado === 0 ? message = 'El progreso de autoevaluación fue guardado con éxito.' : message = 'Tu autoevaluación fue finalizada con éxito.'
            Swal.fire(message, "",'success').then(() => {
              data.registros.estado === 0 ?  window.location.reload() : this.Data = data    
            })  
         
          },
          error: (error) => {
            console.error("Error:", error.message);
            Swal.fire("Error al enviar la autoevaluación.",'',"error");
          }
        }); 
      }
    })
  }  
  
  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }
}