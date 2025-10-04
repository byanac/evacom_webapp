import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import Swal from 'sweetalert2';
import { ModalsService } from 'src/app/services/modals.service';

@Component({
  selector: 'app-evalconsolidatedreportmodal',
  templateUrl: './evalconsolidatedreportmodal.component.html',
  styleUrls: ['./evalconsolidatedreportmodal.component.css']
})
export class EvalconsolidatedreportmodalComponent implements OnInit {
  CalendarData: ISchedule
  CodCalendar: string = ""

  constructor(private renderer: Renderer2, private calendarService: CalendarService, private utilService: UtilsService, private modalStateService: ModalsService ) { }

  async ngOnInit(): Promise<void> {
    const data = await this.calendarService.getDataScheduleApi().toPromise()
    ////console.log(data)
    this.CalendarData = data;
  }

  DownloadExcel(): any{
    this.utilService.showLoading();
    ////console.log(this.CodCalendar)
    ////console.log(this.CalendarData.registros.filter(item => item.vCodigo === this.CodCalendar))
    let FilteredCalendarType: any = this.CalendarData.registros.filter(item => item.vCodigo === this.CodCalendar)
    let tipoCalendario:string = FilteredCalendarType[0].tipo
    ////console.log(tipoCalendario)
    this.utilService.GetConsolidatedExcel(tipoCalendario,this.CodCalendar).subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `consolidado${tipoCalendario}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      Swal.close();
    }, error => {
      console.error('Error downloading the file', error);
      Swal.close();
    });
  }

  CloseModal(): void{
    this.modalStateService.setEvalConsolidatedReportModalHided();
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

}
