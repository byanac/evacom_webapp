import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ICalendarParametrizationFlags } from 'src/app/interfaces/ICalendarParametrizationFlags';
import { ParametrizationService } from 'src/app/services/parametrization/parametrization.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-parametrizar-calendario',
  templateUrl: './parametrizar-calendario.component.html',
  styleUrls: ['./parametrizar-calendario.component.css']
})
export class ParametrizarCalendarioComponent implements OnInit {
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  items: any[];
  activeIndex: number = 0;
  CalendarData: ICalendarParametrizationFlags = null;

  constructor(private route: ActivatedRoute, private parametrizationService: ParametrizationService, private utilsService: UtilsService) { }

  async ngOnInit(): Promise<void> {
    await this.LoadCalendarData()
    if (this.CalendarData.calendario.tipo === '90') {
      this.items = [
        {
          label: 'A.Grupo de evaluación',
        },
        {
          label: 'R.Evaluadores 90°',
        },
      ];
  
      this.setActiveIndex90(
        this.CalendarData.grupoEvaluacionAsignacion,
        this.CalendarData.evaluacionAsignacion90
      );
    }
  
    if (this.CalendarData.calendario.tipo === '180') {
      this.items = [
        {
          label: 'C.Reglas de cálculo',
        },
        {
          label: 'A.Grupo de evaluación',
        },
        {
          label: 'R.Evaluadores 180°',
        },
      ];
  
      this.setActiveIndex180(
        this.CalendarData.reglaCalculo,
        this.CalendarData.grupoEvaluacionAsignacion,
        this.CalendarData.evaluacionAsignacion180
      );
    }
  }

  private setActiveIndex180(
    reglaCalculo: boolean,
    grupoEvaluacionAsignacion: boolean,
    evaluacionAsignacion: boolean
  ): void {
    const caseValue = (reglaCalculo ? 1 : 0) + (grupoEvaluacionAsignacion ? 2 : 0) + (evaluacionAsignacion ? 3 : 0);
    switch (caseValue) {
      case 1:
        this.activeIndex = 1;
        break;
      case 3:
        this.activeIndex = 2;
        break;
      case 6:
        this.activeIndex = 2;
        break;
    }
  }

  private setActiveIndex90(
    grupoEvaluacionAsignacion: boolean,
    evaluacionAsignacion: boolean
  ): void {
    const caseValue = (grupoEvaluacionAsignacion ? 1 : 0) + (evaluacionAsignacion ? 1 : 0);
    //console.log(caseValue)
    switch (caseValue) {
      case 0:
        this.activeIndex = 0;
        break;
      case 1:
        this.activeIndex = 1;
        break;
    }
  }

  async LoadCalendarData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const calendarDataFromApi = await this.parametrizationService.GetParametrizationProgress(this.CalendarID).toPromise();
      this.CalendarData = calendarDataFromApi.registros;
      //console.log(this.CalendarData);
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los datos del calendario:', error);
      return Swal.fire('Error al cargar los datos del calendario', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

}
