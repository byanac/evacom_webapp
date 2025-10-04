import { Component, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router'
import { AddoutstandingfactmodalService } from 'src/app/services/addoutstandingfactmodal/addoutstandingfactmodal.service';


@Component({
  selector: 'app-viewworkerprogression',
  templateUrl: './viewworkerprogression.component.html',
  styleUrls: ['./viewworkerprogression.component.css']
})
export class ViewworkerprogressionComponent implements OnInit {
  TcodFichaFetch: string = this.route.snapshot.paramMap.get('TcodFichaFetch');
  TcodPuestoToFetch: string = this.route.snapshot.paramMap.get('TcodPuestoToFetch');
  EcodFichaFetch: string = this.route.snapshot.paramMap.get('EcodFichaFetch');
  EcodPuestoFetch: string = this.route.snapshot.paramMap.get('EcodPuestoFetch');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  CalendarType: string = this.route.snapshot.paramMap.get('CalendarType');
  TableData:IAutoEvaluationResult
  FactsDataFromApi: any;
  DataFromsessionStorage:ILoginData;
  EvaluationResult: number;

  constructor(
    private peopletobeevaluatedService: PeopletobeevaluatedService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router,
    private Factsservice: AddoutstandingfactmodalService,
    private utilService: UtilsService
  ){}

  async ngOnInit(): Promise<any>  {
    this.utilsService.showLoading();
    try {
            const factsresponse: IAutoEvaluationResult = await ((this.Factsservice.GetOutStandingFactsFromWorker(this.TcodFichaFetch).toPromise()));
            this.FactsDataFromApi = factsresponse;
            const response = await this.peopletobeevaluatedService
              .GetWorkerData(this.TcodFichaFetch, this.TcodPuestoToFetch, this.EcodFichaFetch, this.EcodPuestoFetch, this.CalendarCode)
             .toPromise();
              this.EvaluationResult = response.registros.resultado
               response.registros.oportunidad = response.registros.oportunidad.trim();
               response.registros.fortaleza = response.registros.fortaleza.trim();
              this.TableData = response;
              //console.log(this.TableData)
               this.utilsService.closeLoading();
           } catch (error) {
             //console.log('Error al obtener los datos del trabajador:', error);
             return Swal.fire('Error al obtener los datos de la evaluación ', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
               this.router.navigateByUrl('/home');
             });
           }  
   
    // try {
    //   const evaluatedValidation:any = await this.utilService.GetEvaluatorStatusForPhase('autoeval','ficha',this.TcodFichaFetch,this.CalendarCode).toPromise();    
    //     const factsresponse: IAutoEvaluationResult = await ((this.Factsservice.GetOutStandingFactsFromWorker(this.TcodFichaFetch).toPromise()));
    //     this.FactsDataFromApi = factsresponse;
    //     try {
    //       const response = await this.peopletobeevaluatedService
    //         .GetWorkerData(this.TcodFichaFetch, this.TcodPuestoToFetch, this.EcodFichaFetch, this.EcodPuestoFetch, this.CalendarCode)
    //         .toPromise();
    //         this.EvaluationResult = response.registros.resultado
    //         response.registros.oportunidad = response.registros.oportunidad.trim();
    //         response.registros.fortaleza = response.registros.fortaleza.trim();
    //         this.TableData = response;
    //         ////console.log(this.TableData)
    //         this.utilsService.closeLoading();
    //     } catch (error) {
    //       //console.log('Error al obtener los datos del trabajador:', error);
    //       return Swal.fire('Error al obtener los datos de la evaluación ', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
    //         this.router.navigateByUrl('/home');
    //       });
    //     }    
    // } catch (error) {
    //   if (error.status === 502) {
    //     Swal.fire(
    //       'AVISO',
    //       `${error.error.mensaje}.`,
    //       'warning'
    //     ).then(() => {
    //       this.router.navigateByUrl(`/home/registrar-evaluacion/${this.CalendarType}`);
    //     })
    //   } else {
    //     Swal.fire(
    //       'Error',
    //       'Ocurrió un error inesperado.',
    //       'error'
    //     ).then(() => {
    //       this.router.navigateByUrl(`/home/registrar-evaluacion/${this.CalendarType}`);
    //     })
    //   }
    // } 
  }

}
