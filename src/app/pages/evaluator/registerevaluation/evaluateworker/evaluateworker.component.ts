import { Component, Input, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { LoginService } from 'src/app/services/auth/login.service';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { EvaluatorsService } from 'src/app/services/evaluators/evaluators.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluateworker',
  templateUrl: './evaluateworker.component.html',
  styleUrls: ['./evaluateworker.component.css']
})
export class EvaluateworkerComponent implements OnInit {
  @Input() TableData: IAutoEvaluationResult;
  @Input() FactsData: IEvaluatedFacts;
  @Input() CalendarCode: string = "";
  @Input() TcodFicha: string = "";
  @Input() TcodPuesto: string = "";
  @Input() EcodFicha: string = "";
  CalendarType: string = "";
  DataFromsessionStorage:ILoginData = this.loginService.GetUserSession();
  visible: boolean = false;
  TypeAndPeriodName: string = "";

  constructor(
    private utilsService: UtilsService,
    private peopletobeevaluated: PeopletobeevaluatedService,
    private calendarService: CalendarService,
    private utilService: UtilsService,
    private evaluatorsService: EvaluatorsService,
    private loginService: LoginService
  ){}

  async ngOnInit(): Promise<void> {
    ////console.log(this.TableData)
    ////console.log(this.FactsData)
    this.calendarService.getDataScheduleApi().subscribe(data => {
      ////console.log(data)
      let typeandperiodname: ISchedule = data.registros.filter((item: { tipo: string; }) => item.tipo === this.TableData.registros.tipo);
      this.TypeAndPeriodName = typeandperiodname[0].vNombre
    })
  }

  showDialog() {
    this.visible = true;
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

  
  ReloadPage(): void{
    window.location.reload();
  }
  

  async SaveButton(): Promise<any>{
    if(this.TableData.registros.competenciaOportunidad === this.TableData.registros.competenciaFortaleza){
      return Swal.fire(
        'Competencias Duplicadas',
        'No es posible seleccionar las mismas competencias. Por favor, elige opciones diferentes para continuar.',
        'warning'
      );
    }

    Swal.fire({
      title:  "Aviso",
      text: "¿Estás seguro de que deseas guardar la evaluación colaborador: " + this.TableData.registros.nombre + "?",
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        await this.calendarService.GetCalendarTypeNumber(this.CalendarCode).then(result => {
          this.CalendarType = result;
        });
        
        if(this.TableData.registros.competenciaFortaleza === undefined){
          this.TableData.registros.fortaleza = '';
        }

        if(this.TableData.registros.competenciaOportunidad === undefined){
          this.TableData.registros.oportunidad = '';
        }

        if(this.CalendarType === "90"){
          this.peopletobeevaluated.SaveWorkerData(this.CalendarCode,this.TcodFicha,this.TcodPuesto, this.TableData.registros)
          .subscribe({
            next: (data) => {
              let message: string = "";
              data.registros.estado === 0 ? message = 'El progreso de la evaluación fue guardado con éxito.' : message = 'La evaluación fue finalizada con éxito.'
              Swal.fire(message, "",'success').then(() => {
                data.registros.estado === 0 ?  window.location.reload() : this.TableData = data    
              })  
           
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al enviar la evaluación.",'',"error");
            }
          });  
        }else if(this.CalendarType === "180"){
          this.TableData.registros = this.Add180AditionalFields()
          ////console.log(this.TableData.registros)
          
          this.peopletobeevaluated.SaveWorkerData180(this.CalendarCode,this.TcodFicha,this.TcodPuesto, this.TableData.registros)
          .subscribe({
            next: (data) => {
              let message: string = "";
              data.registros.estado === 0 ? message = 'El progreso de la evaluación fue guardado con éxito.' : message = 'La evaluación fue finalizada con éxito.'
              Swal.fire(message, "",'success').then(() => {
                data.registros.estado === 0 ?  window.location.reload() : this.TableData = data    
              })  
           
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al enviar la evaluación.",'',"error");
            }
          });
          
        }
      }
    })
  } 
  
   
  Add180AditionalFields(): any {
    return {
        ...this.TableData.registros,
        evaluadorFicha: this.DataFromsessionStorage.ficha,
        evaluadorPuesto: this.DataFromsessionStorage.codPuesto
    };
}

removeLeadingZeros(value: string | number): string {
  const input = value.toString();
  return input.replace(/^0+/, '');
}

}