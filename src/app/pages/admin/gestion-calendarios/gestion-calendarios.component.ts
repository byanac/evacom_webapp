import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ICalendarReport } from 'src/app/interfaces/ICalendarReport';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-gestion-calendarios',
  templateUrl: './gestion-calendarios.component.html',
  styleUrls: ['./gestion-calendarios.component.css']
})
export class GestionCalendariosComponent implements OnInit {
  DataToShow: ICalendarReport

  constructor(private router: Router, private calendarService: CalendarService, private utilsService: UtilsService) { }

  async ngOnInit(): Promise<any> {
    this.utilsService.showLoading();
    this.calendarService.getCalendarVigencies().subscribe({
      next: (data) => {
        //console.log(data)
        //let datafiltered = data.registros.filter((data: { vigente: boolean; }) => data.vigente === true); 
        this.DataToShow = data.registros
        this.utilsService.closeLoading();
      },
      error: (error) => {
       ////console.log(error)
      }
    });
  }
}
