import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { SendemailService } from 'src/app/services/sendemail/sendemail.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-historico-evaluacion-detalle-evaluador',
  templateUrl: './historico-evaluacion-detalle-evaluador.component.html',
  styleUrls: ['./historico-evaluacion-detalle-evaluador.component.css']
})
export class HistoricoEvaluacionDetalleEvaluadorComponent implements OnInit {
  EvaluatorFile: string = this.route.snapshot.paramMap.get('EvaluatorFile');
  EvaluatorPosition: string = this.route.snapshot.paramMap.get('EvaluatorPosition');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  EvaluatorName: string = this.route.snapshot.paramMap.get('EvaluatorName')
  EvaluatorData: ILoginData = JSON.parse(sessionStorage.getItem('userdata'))
  CalendarType:string
  TableData: IEvaluatedWorkersFromEvaluator[];
  PeriodName: string = ""

  constructor(
    private route: ActivatedRoute,
    private evaluatorsService: EvaluatorsService, 
    private EmailService: SendemailService,
    private calendarService: CalendarService,
    private utilsService: UtilsService,
  ){ }

  async ngOnInit():Promise<void> {
    this.utilsService.showLoading();
    const response: any = await ((this.evaluatorsService.getWorkersfromEvaluatorReport(this.EvaluatorPosition,this.CalendarCode)).toPromise());
    this.TableData = [...response.registros].sort((a, b) => {
      if (a.estadoEvaluacion === false && b.estadoEvaluacion !== false) {
        return -1;
      }
    });
    
    const CalendarData: any = await ((this.calendarService.getCalendarVigencies())).toPromise();
    const CalendarString = CalendarData.registros.filter((data: { vCodigo: string; }) => data.vCodigo === this.CalendarCode)
    this.PeriodName = CalendarString[0].vNombre
    this.CalendarType = CalendarString[0].tipo
    this.utilsService.closeLoading();;
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  sendEmail(nombre: string, codpuesto: string, codficha: string){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas enviar un recordatorio por correo a ${nombre}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilsService.showLoading();
          this.EmailService.sendKnowledgeEmail(this.CalendarCode, codpuesto, codficha)
          .subscribe({
            next: (data) => {
              ////console.log(data);
              Swal.fire("Recordatorio enviado de manera exitosa.", "","success"
              );
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al enviar el recordatorio.",'',"error");
            }
          });
          }
      });     
  }

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

}
