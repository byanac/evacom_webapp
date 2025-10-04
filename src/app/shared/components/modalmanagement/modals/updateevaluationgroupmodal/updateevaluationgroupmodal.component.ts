import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IEvaluationGroup } from 'src/app/interfaces/IEvaluationGroup';
import { EvalgroupsService } from 'src/app/services/evalgroups/evalgroups.service';
import { UpdateevalgroupService } from 'src/app/services/updateevalgroup/updateevalgroup.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-updateevaluationgroupmodal',
  templateUrl: './updateevaluationgroupmodal.component.html',
  styleUrls: ['./updateevaluationgroupmodal.component.css']
})
export class UpdateevaluationgroupmodalComponent implements OnInit, OnDestroy {
  private modalSubscription!: Subscription;
  @Input() codPuesto: string = "";
  @Input() codCalendario: string = "";
  @Input() nombreTrabajador: string = "";
  
  
  Evalgroups!: IEvaluationGroup;
  SelectedOption: string = "";

  constructor(private upevalgroupService: UpdateevalgroupService, private EvalGroupsService: EvalgroupsService) {}

  ngOnInit(): void {
    this.modalSubscription = this.upevalgroupService.$modal.subscribe(modalState => {
      if (!modalState) {
        this.codPuesto = "";
      }
    });

    if (this.codPuesto === "") {
      this.upevalgroupService.$modal.emit(false);
    }

    this.EvalGroupsService.getEvaluationsGroups().subscribe(data => {
      this.Evalgroups = data;
      ////console.log(data)
    });
  }

  ngOnDestroy(): void {
      this.modalSubscription.unsubscribe();
  }

  changeEvaluationGroup() {
    if(this.SelectedOption != ""){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas actualizar el grupo de evaluación del trabajador ${this.nombreTrabajador}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          ////console.log(this.codCalendario,this.codPuesto,this.SelectedOption)
          this.upevalgroupService.postUpdateEvalGroup(this.codCalendario,this.codPuesto,this.SelectedOption).subscribe({
            next: (data) => {
              ////console.log(data);
              Swal.fire({
                title:  "¡Correcto!",
                text: `El grupo de evaluación del colaborador fue actualizado con éxito.`,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'De acuerdo',
                onClose: () => {this.closeModal("CAR")}
              })
            },
            error: (error) => {
              console.error("Error:", error);
              Swal.fire({
                title:  "Error al actualizar grupo de evaluación.",
                text: error.message,
                type: 'error',
                showCancelButton: false,
                confirmButtonText: 'OK',
                onClose: () => {this.closeModal("")}
              })   
              ////console.log(error.message)
            }
          }); 
        }
      })
  }
}

  closeModal(reloadData : string): void {
    if(reloadData === "CAR"){
      this.upevalgroupService.$modal.emit(false);
      this.upevalgroupService.$reloadDataOnTable.emit(true);
    }else{
      this.upevalgroupService.$modal.emit(false);
    }
  }
}