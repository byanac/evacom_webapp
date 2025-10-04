import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FilepositionperiodfilterService {
  $FileValue = new EventEmitter<string>();
  $PositionValue= new EventEmitter<string>();
  $PeriodValue= new EventEmitter<string>();
  $StatusValue= new EventEmitter<string>();
  
  constructor() { 
    this.$FileValue.emit('')
    this.$PositionValue.emit('')
    this.$PeriodValue.emit('')
    this.$PeriodValue.emit(undefined)
    this.$StatusValue.emit('')
  }
}
