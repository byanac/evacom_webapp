import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IResponse } from 'src/app/interfaces/IResponse ';
import { KnowledgeService } from 'src/app/services/knowledge/knowledge.service';
import Swal from 'sweetalert2';
import { LoginService } from 'src/app/services/auth/login.service';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { AutoevaluationService } from 'src/app/services/autoevaluation/autoevaluation.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  templateUrl: './fase-conocimiento.component.html',
  styleUrls: ['./fase-conocimiento.component.css']
})
export class FaseConocimientoComponent {
  TableData!: IResponse[] 
  ConfirmedButtonOn!: boolean;;
  DataFromsessionStorage?:any;
  LoggedUserData?:ILoginData;
  styleString: string = ''
  UserData: ILoginData
  PeriodName: string = ""

  constructor(private knowledgeService: KnowledgeService, private utilsService: UtilsService, private GetEvaluationProgressionService: AutoevaluationService){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
    this.UserData = JSON.parse(sessionStorage.getItem('userdata')!)
    this.DataFromsessionStorage =  JSON.parse(sessionStorage.getItem('userdata')!)
    this.LoggedUserData = this.DataFromsessionStorage;

    const response: any = await ((await this.knowledgeService.getKnowledgeQuestions()).toPromise());
    const periodname: IAutoEvaluationResult = await ((this.GetEvaluationProgressionService.GetAutoEvalProgression(this.DataFromsessionStorage.ficha, this.DataFromsessionStorage.codPuesto)).toPromise());
    this.PeriodName = periodname.registros.calendario_nombre
    this.TableData = [response];
    this.ConfirmedButtonOn = this.TableData[0].registros.conformidadOtorgada;
    this.utilsService.closeLoading();
  }

  PrintButton(){
    window.print();
  }

  ConfirmButton(){
    const Calendarcode = this.TableData[0].registros.calendario.vCodigo
    ////console.log(Calendarcode)
    Swal.fire({
      title:  "Aviso",
      text: "¿Estás seguro de que deseas enviar la conformidad?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Enviar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
       this.knowledgeService.SendConfirmation(Calendarcode,this.UserData.codPuesto,this.UserData.ficha).subscribe(data => {
        ////console.log(data)
       })
       this.TableData[0].registros.conformidadOtorgada = true;
       Swal.fire('Conformidad enviada', "",'success')
      }
    })
  }
}
