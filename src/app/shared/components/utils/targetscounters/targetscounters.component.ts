import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-targetscounters',
  templateUrl: './targetscounters.component.html',
  styleUrls: ['./targetscounters.component.css']
})
export class TargetscountersComponent implements OnInit {
  @Input() DataToCount: any[] = [];
  @Input() ConfirmedEntryName: string = "";
  @Input() ConfirmText: string = "";
  @Input() NotConfirmedText: string = "";

  constructor() { }

  ngOnInit() {
    ////console.log(this.DataToCount)
  }

  GetConfirmedCount(): number {
    return this.DataToCount.filter(item => item[this.ConfirmedEntryName] === true).length;
  }

  GetRefuseCount(): number {
    return this.DataToCount.filter(item => item[this.ConfirmedEntryName] === false).length;
  }

  GetTasa(): string{
    let resultado = (this.GetConfirmedCount() / this.DataToCount.length) * 100
    return resultado.toFixed(0); 
  }
}
