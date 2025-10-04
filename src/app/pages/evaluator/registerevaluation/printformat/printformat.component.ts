import { Component, OnInit } from '@angular/core';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import { UtilsService } from 'src/app/services/utils/utils.service'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-printformat',
  templateUrl: './printformat.component.html',
  styleUrls: ['./printformat.component.css']
})
export class PrintformatComponent implements OnInit {
  TcodFichaFetch: string = this.route.snapshot.paramMap.get('TcodFichaFetch');
  TcodPuestoToFetch: string = this.route.snapshot.paramMap.get('TcodPuestoToFetch');
  EcodFichaFetch: string = this.route.snapshot.paramMap.get('EcodFichaFetch');
  EcodPuestoFetch: string = this.route.snapshot.paramMap.get('EcodPuestoFetch');
  CalendarCode: string = this.route.snapshot.paramMap.get('CalendarCode');
  Data: IAutoEvaluationResult;
  DataFromsessionStorage?:ILoginData;
  FortalezaNameValue: string = "";
  OportunidadNameValue: string = "";

  constructor(private peopletobeevaluatedService: PeopletobeevaluatedService,private utilsService: UtilsService, private route: ActivatedRoute){}

  async ngOnInit(): Promise<void>  {
    this.utilsService.showLoading();
    const response: IAutoEvaluationResult = await ((this.peopletobeevaluatedService.GetWorkerData(this.TcodFichaFetch,this.TcodPuestoToFetch,this.EcodFichaFetch,this.EcodPuestoFetch,this.CalendarCode)).toPromise());
    this.Data = response;
    this.utilsService.closeLoading();
    setTimeout(() => {
      window.print()
    }, 1000);
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }
}
