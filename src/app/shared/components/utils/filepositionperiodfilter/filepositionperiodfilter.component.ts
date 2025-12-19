import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { FilepositionperiodfilterService } from 'src/app/services/filepositionperiodfilter/filepositionperiodfilter.service';
import { GerencyteamsmultiselectService } from 'src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-filepositionperiodfilter',
  templateUrl: './filepositionperiodfilter.component.html',
  styleUrls: ['./filepositionperiodfilter.component.css']
})
export class FilepositionperiodfilterComponent implements OnInit, OnDestroy,OnChanges  {
  private subscriptions: Subscription = new Subscription();

  @Input() ShowStatusModal: boolean = false;
  @Input() StatusPlaceHolder: string = '';
  @Input() FalseText: string = '';
  @Input() TrueText: string = '';
  @Input() NotCalendarVigencies: boolean = false;
  @Input() StatusOptionWidth: string = '';

  @Input() initialFicha: string = '';
  @Input() initialPuesto: string = '';
  @Input() initialPeriodo: string = '';

  Ficha: string = '';
  Puesto: string = '';
  Periodo: string = '';
  Estado: string = '';
  FichaPH: string = 'Cod.Ficha';
  PuestoPH: string = 'Cod.Puesto';
  disablepuestofield: boolean = false;
  disablefichafield: boolean = false;
  TeamsToSend: any = [];
  calendarData: any = [];

  constructor(
    private calendarService: CalendarService,
    private componentService: FilepositionperiodfilterService,
    private gerencyteamService: GerencyteamsmultiselectService,
    private utilsService: UtilsService
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      //console.log('Cargando datos de calendario...');
      // Restaurar valores si vienen del padre
        if (this.initialFicha) {
          this.Ficha = this.initialFicha;
          this.componentService.$FileValue.emit(this.padLeftWithZeros(this.initialFicha));
        }

        if (this.initialPuesto) {
          this.Puesto = this.initialPuesto;
          this.componentService.$PositionValue.emit(this.initialPuesto);
        }





      if (!this.NotCalendarVigencies) {
        //console.log('cargando calendarios vigentes')
        this.calendarData = await this.calendarService.getDataScheduleApi().toPromise();
      } else {
        //console.log('cargando calendarios NO vigentes')
        const response = await this.calendarService.getCalendarVigencies().toPromise();
        this.calendarData = {...response, registros: response.registros.filter(item => item.vigente === false)};
      }
  
      if (this.calendarData && this.calendarData.registros.length) {
        this.Periodo = this.calendarData.registros[this.calendarData.registros.length - 1].vCodigo;
      }
        if (this.initialPeriodo) {
          this.Periodo = this.initialPeriodo;
          this.componentService.$PeriodValue.emit(this.initialPeriodo);
        }
        if (this.initialPeriodo) {
          this.Periodo = this.initialPeriodo;
          this.componentService.$PeriodValue.emit(this.initialPeriodo);
      }
  
      //console.log('Datos de calendario cargados:', this.calendarData);
    } catch (error) {
      console.error('Error al cargar datos del calendario:', error);
    }

    this.subscriptions.add(
      this.gerencyteamService.$TeamArray.subscribe((jsonEquipos: any) => {
        this.TeamsToSend = jsonEquipos;
        if (this.TeamsToSend.length !== 0) {
          this.disablepuestofield = true;
          this.disablefichafield = true;
          this.Ficha = '';
          this.Puesto = '';
          this.FichaPH = 'Cod.Ficha (Bloqueado)';
          this.PuestoPH = 'Cod.Puesto (Bloqueado)';
        } else {
          this.disablepuestofield = false;
          this.disablefichafield = false;
          this.FichaPH = 'Cod.Ficha';
          this.PuestoPH = 'Cod.Puesto';
        }
      })
    );
  
    this.subscriptions.add(
      this.utilsService.$ResetFiltersValues.subscribe((value: boolean) => {
        if (value) {
          this.resetFilters();
        }
      })
    );
  
    this.SendCalendarCode();
  }

 ngOnChanges(changes: SimpleChanges) {
  if (changes['initialFicha']) this.Ficha = this.initialFicha;
  if (changes['initialPuesto']) this.Puesto = this.initialPuesto;
  if (changes['initialPeriodo']) this.Periodo = this.initialPeriodo;

  // Y envías los valores a tu servicio si lo necesitas
  this.componentService.$FileValue.emit(this.Ficha);
  this.componentService.$PositionValue.emit(this.Puesto);
  this.componentService.$PeriodValue.emit(this.Periodo);
}



  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadCalendarData(): void {
    const calendarObservable = this.NotCalendarVigencies
      ? this.calendarService.getCalendarVigencies()
      : this.calendarService.getDataScheduleApi();

    const sub = calendarObservable
      .pipe(
        catchError((err) => {
          console.error('Error al cargar datos del calendario:', err);
          return of([]); 
        }),
        finalize(() => {
          //console.log('Datos de calendario cargados.');
        })
      )
      .subscribe((data: any) => {
        this.calendarData = data.registros || data;
        if (this.calendarData.length) {
          this.Periodo = this.calendarData[this.calendarData.length - 1].vCodigo || '';
        }
        //console.log('Datos de calendario:', this.calendarData);
        this.SendCalendarCode();
      });

    this.subscriptions.add(sub);
  }


  private handleResetFilters(): void {
    const sub = this.utilsService.$ResetFiltersValues.subscribe((value: boolean) => {
      if (value) {
        this.resetFilters();
      }
    });

    this.subscriptions.add(sub);
  }

  private updateFieldStates(): void {
    if (this.TeamsToSend.length > 0) {
      this.disablepuestofield = true;
      this.disablefichafield = true;
      this.Ficha = '';
      this.Puesto = '';
      this.FichaPH = 'Cod.Ficha (Bloqueado)';
      this.PuestoPH = 'Cod.Puesto (Bloqueado)';
    } else {
      this.disablepuestofield = false;
      this.disablefichafield = false;
      this.FichaPH = 'Cod.Ficha';
      this.PuestoPH = 'Cod.Puesto';
    }
  }

  private resetFilters(): void {
    this.disablepuestofield = false;
    this.disablefichafield = false;
    this.FichaPH = 'Cod.Ficha';
    this.PuestoPH = 'Cod.Puesto';
    this.Ficha = '';
    this.Puesto = '';
    this.Periodo = '';
    this.Estado = undefined;

    this.componentService.$FileValue.emit(this.Ficha);
    this.componentService.$PositionValue.emit(this.Puesto);
    this.componentService.$PeriodValue.emit(this.Periodo);
    this.componentService.$StatusValue.emit(this.Estado);
  }

  OnTypingPuesto(value: string): void {
    if (value.length > 0) {
      this.disablefichafield = true;
      this.Ficha = '';
      this.FichaPH = 'Cod.Ficha (Bloqueado)';
      this.componentService.$FileValue.emit('');
    } else {
      this.disablefichafield = false;
      this.FichaPH = 'Cod.Ficha';
    }
    this.componentService.$PositionValue.emit(value);
  }

  padLeftWithZeros(value: number | string): string {
    const input = value.toString();
    return input.padStart(8, '0');
  }

  OnTypingFicha(value: string): void {
    this.Ficha = value;
    this.componentService.$FileValue.emit(this.padLeftWithZeros(value));
  }

  SendCalendarCode(): void {
    this.componentService.$PeriodValue.emit(this.Periodo);
  }

  SendStatusValue(): void {
    this.componentService.$StatusValue.emit(this.Estado);
  }
}
