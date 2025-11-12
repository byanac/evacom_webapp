import { UtilsService } from 'src/app/services/utils/utils.service';
import { Component, Input, OnInit } from '@angular/core';
import { IAddoutstandingfact } from 'src/app/interfaces/IAddoutstandingfact';
import { IAutoEvaluationResult } from 'src/app/interfaces/IAutoEvaluationResult';
import { AddoutstandingfactmodalService } from 'src/app/services/addoutstandingfactmodal/addoutstandingfactmodal.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { PeopletobeevaluatedService } from 'src/app/services/peopletobeevaluated/peopletobeevaluated.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addoutstandingfactmodal',
  templateUrl: './addoutstandingfactmodal.component.html',
  styleUrls: ['./addoutstandingfactmodal.component.css']
})
export class AddoutstandingfactmodalComponent implements OnInit {
  SelectedStanding: string = "";
  SelectedCompetency: string = "";
  SelectedBehavior: string = "";
  SelectedStandingDescription: string = "";
  Selectedtype: string = "";
  LoggedUserFolder: string = "";
  FormSelectsData: any;
  CompetencyData: any;
  SesionData = this.loginService.GetUserSession();

  @Input() WorkerName: string = "";
  @Input() WorkerFolder: string = "";
  @Input() WorkerPosition: string = "";
  @Input() EvaluatorFolder: string = "";
  @Input() EvaluatorPosition: string = "";
  @Input() Calendar: string = "";
  @Input() Calendario: string = "";

  constructor(
    private modalService: AddoutstandingfactmodalService,
    private peopletobeevaluatedService: PeopletobeevaluatedService,
    private utilsService: UtilsService,
    private loginService: LoginService
  ){}

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading();
    let DataFromsessionStorage = JSON.parse(sessionStorage.getItem('userdata'))
    this.LoggedUserFolder = DataFromsessionStorage.ficha
    
    try{
      const response: IAutoEvaluationResult = await ((this.peopletobeevaluatedService.GetWorkerData(this.WorkerFolder,this.WorkerPosition,this.SesionData.ficha,this.SesionData.codPuesto,this.Calendar)).toPromise());
          this.FormSelectsData = response.registros
          this.utilsService.closeLoading();;
    }catch(error){
        this.CloseModal();
Swal.fire(
          'AVISO',
           'Por favor valide que tenga grupo de evaluación asignado',
          'error'
        );
  //  this.utilsService.closeLoading();;
    }
  
 /*this.peopletobeevaluatedService
    .GetWorkerData(this.WorkerFolder, this.WorkerPosition, this.SesionData.ficha, this.SesionData.codPuesto, this.Calendar)
    .subscribe({
        // Callback para datos exitosos (código 200)
        next: (response: IAutoEvaluationResult) => {
            this.FormSelectsData = response.registros;
            this.utilsService.closeLoading();
        },
        // Callback para errores 
        error: (error) => {
          console.log("error2");
            this.CloseModal();
            Swal.fire(
                'AVISO',
                'Por favor valide que tenga grupo de evaluación asignado',
                'error'
            );
        },
        complete: () => {
             // Opcional: código de limpieza
        }
    });*/
   
  }

  handleChange(evt: any): void{
    this.Selectedtype = evt.target.value;
  }

  CloseModal():void{
    this.modalService.$modal.emit(false);
    this.WorkerName = "";
    this.WorkerFolder = "";
    this.Calendar = "";
  }

  ChangeSelectedCompetency(evt: any): void{
    // ////console.log(evt.target.value)
    let FilteredComportament = this.FormSelectsData.competenciasResultado.filter((item: { codigo: any; }) => item.codigo === evt.target.value)
    this.CompetencyData = FilteredComportament
    // ////console.log(this.CompetencyData)
  }
  

  SendData(): any{
    // ////console.log(this.SelectedBehavior)
    // ////console.log(this.SelectedCompetency)
    // ////console.log(this.SelectedStandingDescription)
    // ////console.log(this.Selectedtype)
    if(this.SelectedBehavior === "" || this.SelectedCompetency === "" || this.SelectedStandingDescription === "" || this.Selectedtype === ""){
     return Swal.fire("Llene todos los campos para registrar un hecho resaltante.","","error")  
    }

    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas guardar el hecho resaltante ingresado de: ${this.WorkerName}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilsService.showLoading();
        let indicadorValue: number;
        if(this.Selectedtype === "p"){
          indicadorValue = 1;
        }else{
          indicadorValue = 0;
        }

        let PostBody: IAddoutstandingfact = {
          trabajador_ficha: this.WorkerFolder,
          evaluador_ficha: this.LoggedUserFolder,
          competencia_codigo: this.SelectedCompetency,
          comportamiento_codigo: this.SelectedBehavior,
          indicador: indicadorValue,
          descripcion: this.SelectedStandingDescription,
          calendario: this.Calendario
        }

        ////console.log(PostBody)

        this.modalService.SaveWorkerOutStandingFact(PostBody).subscribe({
          next: (data) => {
            ////console.log(data)
            Swal.fire({
              title:  "Hecho resaltante registrado con éxito.",
              text: "",
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
              onClose: () => {
                this.CloseModal()
              }
            }) 
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error al registrar el hecho resaltante.",
              text: error.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
            ////console.log("Error:", error.message)
          }
        });
      }
    })
  }
}
