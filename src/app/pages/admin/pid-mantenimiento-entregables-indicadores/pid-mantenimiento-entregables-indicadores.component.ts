import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPIDIndicatosAndDeliverablesMaintenance } from 'src/app/interfaces/IPIDIndicatosAndDeliverablesMaintenance';
import { PidService } from 'src/app/services/pid/pid.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pid-mantenimiento-entregables-indicadores',
  templateUrl: './pid-mantenimiento-entregables-indicadores.component.html',
  styleUrls: ['./pid-mantenimiento-entregables-indicadores.component.css']
})
export class PidMantenimientoEntregablesIndicadoresComponent implements OnInit {
  ShowMainteanceModal: boolean = false;
  Add: boolean = false;
  Type: string = "";
  TypeIndividual: string = "";
  Indicadores: boolean = false;
  Entregables: boolean = false;
  DataToShow: IPIDIndicatosAndDeliverablesMaintenance[]
  TypeToCreate: boolean = false;
  SelectedItemID: number;

  constructor(private router: Router, private PIDservice: PidService, private utilsService: UtilsService) { }

  async ngOnInit(): Promise<any> {
    Swal.fire({
      title:  "Antes de empezar",
      text: `¿Con cuál modalidad quieres visualizar los datos?`,
      type: 'warning',
      showConfirmButton: true,
      showCancelButton: true,
      showCloseButton: true,
      confirmButtonText: 'Entregables',
      cancelButtonText: "Indicadores",
      cancelButtonColor: "orange",
    }).then((result) => {
      if (result.value) {
        this.Type = 'Entregables';
        this.TypeIndividual = 'entregable'
        this.Entregables = true;
        this.LoadData();
      }else if(result.dismiss === Swal.DismissReason.cancel){
        this.Type = 'Indicadores';
        this.TypeIndividual = 'indicador'
        this.Indicadores = true;
        this.LoadData();
      }else if(result.dismiss === Swal.DismissReason.close || result.dismiss === Swal.DismissReason.backdrop){
        this.router.navigate(['/home']);
      }
    }) 
  }

  LoadData():void{
    this.utilsService.showLoading()
    if(this.Entregables){
      this.PIDservice.PIDGetDeliverables().subscribe({
        next: (data) => {
          let datafil = data.registros.filter(data => data.estado === 1); 
          this.DataToShow = datafil
          ////console.log(this.DataToShow)
          this.utilsService.closeLoading();
        },
        error: (error) => {
         ////console.log(error)
        }
    });
    }else if(this.Indicadores){
      this.PIDservice.PIDGetIndicators().subscribe({
        next: (data) => {
          let datafil = data.registros.filter(data => data.estado === 1); 
          this.DataToShow = datafil
          ////console.log(this.DataToShow)
          this.utilsService.closeLoading();
        },
        error: (error) => {
         ////console.log(error)
        }
    });
    } 
  }

  ShowModal(AddItem: string, typeToCreate: string,ItemId: number){
    if(AddItem === 'Add'){
      this.Add = true;
    }else{
      this.Add = false
    }

    if(typeToCreate === 'entregable'){
      this.TypeToCreate = true
    }else if(typeToCreate === 'indicador'){
      this.TypeToCreate = false;
    }
    this.ShowMainteanceModal = true;
    this.SelectedItemID = ItemId
  }

  closeModal(event: boolean) {
    this.ShowMainteanceModal = event;
    this.LoadData();
  }


  DeleteItem(itemCode:number, ItemName: string, ItemGroup:string, ItemDescription: string): void{
    let PostBody = {
      codigo: itemCode,
      grupo: ItemGroup,
      valor: ItemName,
      descripcion: ItemDescription,
      estado: 0
    };

    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el ${this.TypeIndividual} ${ItemName} del listado de ${this.Type}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.value) {
        this.PIDservice.PIDCreateUpdateDeleteConstants(PostBody).subscribe({
          next: (data) => {
            ////console.log(data)
            Swal.fire(`El ${this.TypeIndividual} ${ItemName} fue eliminado`,`El ${this.TypeIndividual} ${ItemName} fue eliminado con éxito.`,"success").then(() => {
              this.LoadData();
            })
          },
          error: (error) => {
           ////console.log(error)
          }
      });
      }
    })
  }

}
