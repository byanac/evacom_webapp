import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { AddoutstandingfactmodalService } from 'src/app/services/addoutstandingfactmodal/addoutstandingfactmodal.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historico-hechos-resaltantes-detalle-evaluador',
  templateUrl: './historico-hechos-resaltantes-detalle-evaluador.component.html',
  styleUrls: ['./historico-hechos-resaltantes-detalle-evaluador.component.css']
})
export class HistoricoHechosResaltantesDetalleEvaluadorComponent implements OnInit {
  EvaluatorFile: string = this.route.snapshot.paramMap.get('EvaluatorFile');
  EvaluatorPosition: string = this.route.snapshot.paramMap.get('EvaluatorPosition');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  EvaluatorName: string = this.route.snapshot.paramMap.get('EvaluatorName')
  EvaluatorData: ILoginData = JSON.parse(sessionStorage.getItem('userdata'))
  CalendarType:string
  TableData: IEvaluatedWorkersFromEvaluator[];
  PeriodName: string = ""
  FactsData: any
  visible: boolean = false;
  EvaluatedName: string = "";

  constructor(
    private route: ActivatedRoute,
    private calendarService: CalendarService,
    private utilsService: UtilsService,
    private peopletobeevaluatedService: PeopletobeevaluatedService,
    private Factsservice: AddoutstandingfactmodalService
  ){ }

  async ngOnInit():Promise<void> {
    this.utilsService.showLoading();
    const response: any = await ((this.Factsservice.GetHistoricEvalutedsByEvaluatorReport(this.EvaluatorPosition,this.CalendarCode)).toPromise());

    this.TableData = [...response.registros].sort((a, b) => {
      if (a.registraHechos === false && b.registraHechos !== false) {
        return -1;
      }
    });

    //console.log(this.TableData)

    const CalendarData: any = await ((this.calendarService.getCalendarVigencies())).toPromise();
    const CalendarString = CalendarData.registros.filter((data: { vCodigo: string; }) => data.vCodigo === this.CalendarCode)
    this.PeriodName = CalendarString[0].vNombre
    this.CalendarType = CalendarString[0].tipo
    this.utilsService.closeLoading();;
  }


  async showDialog(data: any): Promise<any> {
    this.utilsService.showLoading();
    this.EvaluatedName = data.apellidosNombres
    const factsresponse: any = await (this.Factsservice.GetHistoricOutStandingFactsFromWorker(data.codigoFicha, this.CalendarCode).toPromise());
    //console.log(factsresponse)
    this.FactsData = factsresponse;
    this.utilsService.closeLoading();
    this.visible = true;
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  DecodeDate(texto: string):string {
    return this.utilsService.DecodeDate(texto)
  }

  GetTypeText(texto: number):string{
    if(texto === 1){
      return "Positivo"
    }else{
      return "Negativo"
    }
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

}
