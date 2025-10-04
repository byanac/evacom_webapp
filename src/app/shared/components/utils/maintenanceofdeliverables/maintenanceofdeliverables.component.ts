import { LoginService } from 'src/app/services/auth/login.service';
import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { PidService } from 'src/app/services/pid/pid.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maintenanceofdeliverables',
  templateUrl: './maintenanceofdeliverables.component.html',
  styleUrls: ['./maintenanceofdeliverables.component.css']
})
export class MaintenanceofdeliverablesComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() add = new EventEmitter<boolean>();
  @Input() Type = new EventEmitter<boolean>();
  @Input() TypeToCreate = new EventEmitter<boolean>();
  @Input() ItemID = new EventEmitter<number>();

  NombreValor: string = ""
  DescripcionValor: string = ""

  isAnDeliverable: boolean = false;
  isAnIndicator: boolean = false;
  
  es: any;
  rangeDates: Date[];
  
  constructor( private renderer: Renderer2, private PIDservice: PidService, private utilsService: UtilsService, private utilService: UtilsService) { }
  
  async ngOnInit(): Promise<any> {
    ////console.log(this.add)
    if(this.TypeToCreate && this.add){
      this.isAnDeliverable = true;
      ////console.log('CREANDO UN ENTREGABLE')
    }else if(!this.TypeToCreate && this.add){
      this.isAnIndicator = true
      ////console.log('CREANDO UN INDICADOR')
    }

    if(this.TypeToCreate && !this.add){
      this.utilService.showLoading();
      this.isAnDeliverable = true;
      const Dataresponse: any = await ((await this.PIDservice.PIDGetDeliverables()).toPromise());
      ////console.log(this.ItemID)
      let response = Dataresponse.registros.filter(data => data.codigo === this.ItemID)[0]; 
      ////console.log(response)
      this.NombreValor = response.valor
      this.DescripcionValor = response.descripcion
      ////console.log('EDITANDO UN ENTREGABLE')
      this.utilService.closeLoading();
    }else if(!this.TypeToCreate && !this.add){
      this.utilService.showLoading();
      this.isAnIndicator = true
      const Dataresponse: any = await ((await this.PIDservice.PIDGetIndicators()).toPromise());
      ////console.log(this.ItemID)
      let response = Dataresponse.registros.filter(data => data.codigo === this.ItemID)[0]; 
      ////console.log(response)
      this.NombreValor = response.valor
      this.DescripcionValor = response.descripcion
      ////console.log('EDITANDO UN INDICADOR')
      this.utilService.closeLoading();
    }
  }

  CreateUpdateType(): any{
    this.utilsService.showLoading();
    let Tipo = this.isAnDeliverable? 'entregable' : 'indicador'
    let AñadirOEliminar = this.add? 'añadir' : 'editar'
    let AñadirOEliminarCapital = this.add? 'Añadir' : 'Editar'
    let PostBody:any

    if(this.NombreValor === ''){
      return  Swal.fire(`El nombre de su ${Tipo} está vacío`, `Debe de ingresar un nombre para continuar.`,'error')
    }

    if(this.DescripcionValor === ''){
      return  Swal.fire(`La descripción de su ${Tipo} está vacío`, `Debe de ingresar una descripción para continuar.`,'error')
    }

    if(this.isAnDeliverable && this.add){
      PostBody = {
        codigo: 0,
        grupo: "ENTREGABLE",
        valor: this.NombreValor,
        descripcion: this.DescripcionValor,
        estado: 1 
      };
    }else if(this.isAnIndicator && this.add){
      PostBody = {
        codigo: 0,
        grupo: "INDICADOR",
        valor: this.NombreValor,
        descripcion: this.DescripcionValor,
        estado: 1 
      };
    }

    if(this.TypeToCreate && !this.add){
      PostBody = {
        codigo: this.ItemID,
        grupo: "ENTREGABLE",
        valor: this.NombreValor,
        descripcion: this.DescripcionValor,
        estado: 1 
      };
    }else if(!this.TypeToCreate && !this.add){
      PostBody = {
        codigo: this.ItemID,
        grupo: "INDICADOR",
        valor: this.NombreValor,
        descripcion: this.DescripcionValor,
        estado: 1 
      };
    }

    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas ${AñadirOEliminar} el siguiente ${Tipo}: ${this.NombreValor}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: AñadirOEliminarCapital,
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.PIDservice.PIDCreateUpdateDeleteConstants(PostBody).subscribe({
          next: (data) => {
            ////console.log(data)
            if(this.add){
              Swal.fire(`Su ${Tipo} fue creado`, `Su ${Tipo} fue creado con éxito.`,'success').then(() => {
                this.CloseModal()
              })
            }else{
              Swal.fire(`Su ${Tipo} fue editado`, `Su ${Tipo} fue editado con éxito.`,'success').then(() => {
                this.CloseModal()
              })
            }
          },
          error: (error) => {
            ////console.log(error)
            Swal.fire(`ERROR`, `Hubo un error al crear su ${Tipo}.`,'error')
          }
      });
      }
    })
  }

  CloseModal(): void{
    this.close.emit(false);
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
  }

}
