import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { LoginService } from 'src/app/services/auth/login.service';

@Component({
  selector: 'app-feedbackmodal',
  templateUrl: './feedbackmodal.component.html',
  styleUrls: ['./feedbackmodal.component.css']
})
export class FeedbackmodalComponent implements OnInit {
  @Input() Evaluator = new EventEmitter<boolean>();
  @Input() AdminReport = new EventEmitter<boolean>(); 
  @Input() EvaluatorReport = new EventEmitter<boolean>(); 
  @Input() SaveEvaluatedFeedback = new EventEmitter<boolean>(); 
  @Input() EvaluatorType = new EventEmitter<string>();
  @Output() close = new EventEmitter<boolean>();

  UserSession: ILoginData = this.loginService.GetUserSession();
  EvaluatorFeedback:string = "";
  EvaluatedFeedback:string = "";
  CloseButtonText:string = "";
  EvaluatorTypeBoolean: string | EventEmitter<boolean> | boolean;
  TodayDate = new Date(); 

  constructor(private loginService: LoginService) {}

  ngOnInit() {
    ////console.log(this.EvaluatorType)

    if(this.EvaluatorReport){
      this.CloseButtonText = 'Cancelar'
    }else{
      this.CloseButtonText = 'Cerrar'
    }

    if(this.Evaluator){
      this.EvaluatorFeedback = "";
    }else{
      this.EvaluatorFeedback = "Retroalimentación de prueba ";
    }

    if(this.SaveEvaluatedFeedback){
      this.EvaluatorFeedback = "Evaluación de prueba"
    }

    if(this.AdminReport){
      this.EvaluatorFeedback = "Prueba"
      this.EvaluatedFeedback = "Prueba"
    }
  }

  CloseModal(): void{
    this.close.emit(false);
  }

}
