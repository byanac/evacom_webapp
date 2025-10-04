import { Component, Input} from '@angular/core';
import { IResponse } from 'src/app/interfaces/IResponse ';

@Component({
  selector: 'app-questionstable',
  templateUrl: './questionstable.component.html',
  styleUrls: ['./questionstable.component.css']
})
export class QuestionstableComponent {
  @Input() Data!: IResponse[];

}