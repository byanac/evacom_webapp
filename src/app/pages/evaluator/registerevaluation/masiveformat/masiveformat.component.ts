import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-masiveformat',
  templateUrl: './masiveformat.component.html',
  styleUrls: ['./masiveformat.component.css']
})
export class MasiveformatComponent implements OnInit {
  Data: any;
  DataFromsessionStorage?:ILoginData;
  CalendarCode:string = "";
  FortalezaNameValue: string = "";
  OportunidadNameValue: string = "";
  ECodPuesto: string = this.route.snapshot.paramMap.get('ECodPuesto');
  ECodFicha: string = this.route.snapshot.paramMap.get('ECodFicha');
  CalendarType: string = this.route.snapshot.paramMap.get('CalendarType');

  constructor(
    private peopletobeevaluatedService: PeopletobeevaluatedService, 
    private utilsService: UtilsService,
    private route: ActivatedRoute
  ){}

  async ngOnInit(): Promise<void>  {
    this.utilsService.showLoading();
    const response: any = await ((await (this.peopletobeevaluatedService.GetWorkersPreEvaluations(this.CalendarType, this.ECodPuesto, this.ECodFicha))).toPromise());
    ////console.log(response.registros.length)
    this.Data = response;
    this.utilsService.closeLoading();
    if(this.Data.registros.length === 0){
      Swal.fire('No se encontraron registros','',"info").then(() => {
        window.close();
      })
    }else{
      if(this.Data != undefined || null){
        setTimeout(() => {
          window.print();
  
          setTimeout(() => {
              window.close();
          }, 500); 
      }, 1000);
      }
    }
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }
}
