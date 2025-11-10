import { UtilsService } from './../../../services/utils/utils.service';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { LoginService } from 'src/app/services/auth/login.service';
import { ModalsService } from 'src/app/services/modals.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { CommonModule } from '@angular/common';
import { AddoutstandingfactmodalService } from 'src/app/services/addoutstandingfactmodal/addoutstandingfactmodal.service';

@Component({
  selector: 'app-modalmanagement',
  templateUrl: './modalmanagement.component.html',
  styleUrls: ['./modalmanagement.component.css'],
})
export class ModalmanagementComponent implements OnInit {
  DataFromsessionStorage:ILoginData = this.loginService.GetUserSession();
  FactsData: IEvaluatedFacts
  visible: boolean = true;

  constructor(
    public modalStateService: ModalsService, 
    public loginService: LoginService, 
    public peopletobeevaluatedService: PeopletobeevaluatedService, 
    private utilService: UtilsService,  
    private renderer: Renderer2,
    private Factsservice: AddoutstandingfactmodalService ) {}

  async ngOnInit(): Promise<any> {
    
    const isEvaluated = this.loginService.isUserEvaluated();
    // Cargar datos si el usuario tiene rol asignado
    if ((isEvaluated && isEvaluated.estadoEvaluado)) {
      //console.log(isEvaluated && isEvaluated.estadoEvaluado)
      if (isEvaluated.estadoEvaluado) {
        const factsResponse = await this.Factsservice.GetOutStandingFactsFromWorker(this.DataFromsessionStorage.ficha).toPromise();
        this.FactsData = factsResponse;
      }
    }
  }

  ActivateModalsContainer() {
     return this.modalStateService.setModalsVisible();
  }

  HideModalsContainer() {
     return this.modalStateService.setModalsHided();
  }

  openAutorizateCalibrationModal() {
     return this.modalStateService.setAutorizateCalibrationModalVisible();
  }

  closeAutorizateCalibrationModal() {
     return this.modalStateService.setAutorizateCalibrationModalHided();
  }

  openEvalConsolidatedReportModal() {
     return this.modalStateService.setEvalConsolidatedReportModalVisible();
  }

  closeEvalConsolidatedReportModal() {
     return this.modalStateService.setEvalConsolidatedReportModalHided();
  }

  openOutstandingfactModal() {
     return this.modalStateService.setFactsDataModalVisible();
  }

  closeOutstandingfactModal() {
    this.visible = false;
    setTimeout(() => {
      this.visible = true;
    }, 0);
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
     return this.modalStateService.setFactsDataModalVisibleHided();
  }

  
  DecodeDate(texto: string):string {
    return this.utilService.DecodeDate(texto)
  }

  GetTypeText(texto: number):string{
    if(texto === 1){
      return "Positivo"
    }else{
      return "Negativo"
    }
  }
}
