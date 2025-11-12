import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/auth/login.service';
import { AutoevaluationService } from 'src/app/services/autoevaluation/autoevaluation.service';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { KnowledgeService } from 'src/app/services/knowledge/knowledge.service';
import { IResponse } from 'src/app/interfaces/IResponse ';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  templateUrl: './fase-evaluacion.component.html',
  styleUrls: ['./fase-evaluacion.component.css']
})
export class FaseEvaluacionComponent implements OnInit {
  TableData!: IAutoEvaluationResult
  DataFromsessionStorage?:ILoginData;
  CalendarCode:string = "";
  AutoEvaluationResult: number = 0

  constructor(
    private utilsService: UtilsService,
    private GetEvaluationProgressionService: AutoevaluationService,
    private knowledgeService: KnowledgeService,
    private router: Router){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
    this.DataFromsessionStorage = JSON.parse(sessionStorage.getItem('userdata')!);
    debugger
    const Knowledge: IResponse = await ((await this.knowledgeService.getKnowledgeQuestions()).toPromise());
    let ConformidadOtorgada: boolean = Knowledge.registros.conformidadOtorgada

    if(ConformidadOtorgada){
      const response: IAutoEvaluationResult = await ((this.GetEvaluationProgressionService.GetAutoEvalProgression(this.DataFromsessionStorage.ficha, this.DataFromsessionStorage.codPuesto)).toPromise());
      this.AutoEvaluationResult = response.registros.resultado
      response.registros.oportunidad = response.registros.oportunidad.trim();
      response.registros.fortaleza = response.registros.fortaleza.trim();
      this.TableData = response;
      ////console.log(this.TableData)
      this.utilsService.closeLoading();
    }else{
      Swal.fire("Aviso","Debe dar su conformidad a la fase de conocimiento para poder realizar su autoevaluación.","warning").then(() => {
        this.router.navigate(['/home']);
      })
    }

  }
}