import { Component, OnInit,Renderer2 } from '@angular/core';
import { AdminReport } from 'src/app/interfaces/AdminReport';
import { AdminService } from 'src/app/services/admin/admin.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-administradores',
  templateUrl: './registro-administradores.component.html',
  styleUrls: ['./registro-administradores.component.css']
})
export class RegistroAdministradoresComponent implements OnInit {
  DataList: AdminReport[]
  showregisteradministratormodal: boolean = false;

  constructor(
    private adminService: AdminService,
    private utilsService: UtilsService,
    private renderer: Renderer2
  ){}

  async ngOnInit(): Promise<any>{
    this.LoadTableData();
  }

  async LoadTableData(): Promise<any>{
    this.utilsService.showLoading();
    const adminReportData = await this.adminService.GetAdminsReport().toPromise();
    let filteredReportData = adminReportData.registros.filter((data: { estado: number; }) => data.estado != 2)
    this.DataList = filteredReportData;
    //console.log(this.DataList)
    this.utilsService.closeLoading()
  }

  ngOnDestroy(): void {}

  onImgError(event){
    event.target.src = 'assets/img/ProfilePicturePlaceHolder.jpg'
  }

  removeLeadingZeros(value: string | number): string {
    const input = value.toString();
    return input.replace(/^0+/, '');
  }

  async ActivateAdmin(apellNombre:string, codFicha: string): Promise<void>{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar al administador: ${apellNombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Activar',
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        const adminData = await this.adminService.GetAdminInfo(codFicha).toPromise();
        let AdminData = adminData.registros
        AdminData.estado = 1
        //console.log(AdminData)
        this.adminService.PutSaveAdmin(AdminData)
        .subscribe({
          next: (data) => {
            Swal.fire("El administrador ha sido activado exitosamente.", "","success").then(() => {
              this.LoadTableData();
            });
          },
          error: (error) => {
            console.error("Error:", error.message);
            Swal.fire("Error al registrar al administrador.",'',"error");
          }
        });
        }
    });   
  }

  async DeactivateAdmin(apellNombre:string, codFicha: string): Promise<void>{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas desactivar al administador: ${apellNombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Desactivar',
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        const adminData = await this.adminService.GetAdminInfo(codFicha).toPromise();
        let AdminData = adminData.registros
        AdminData.estado = 0
        //console.log(AdminData)
        this.adminService.PutSaveAdmin(AdminData)
        .subscribe({
          next: (data) => {
            Swal.fire("El administrador ha sido desactivado exitosamente.", "","success").then(() => {
              this.LoadTableData();
            });
          },
          error: (error) => {
            console.error("Error:", error.message);
            Swal.fire("Error al registrar al administrador.",'',"error");
          }
        });
        }
    });   
  }
  
  async EliminateAdmin(apellNombre:string, codFicha: string): Promise<void>{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar al administador: ${apellNombre}?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        const adminData = await this.adminService.GetAdminInfo(codFicha).toPromise();
        let AdminData = adminData.registros
        AdminData.estado = 2
        //console.log(AdminData)
        this.adminService.PutSaveAdmin(AdminData)
        .subscribe({
          next: (data) => {
            Swal.fire("El administrador ha sido eliminado exitosamente.", "","success").then(() => {
              this.LoadTableData();
            });
          },
          error: (error) => {
            console.error("Error:", error.message);
            Swal.fire("Error al registrar al administrador.",'',"error");
          }
        });
        }
    });   
  }

  ShowModal(){
    this.renderer.setStyle(document.body, 'overflow-y', 'hidden');
    this.showregisteradministratormodal = true;
  }

  closeModal(event: boolean) {
    this.showregisteradministratormodal = event;
    this.LoadTableData();
  }

  GetConfirmedCount(): number {
    return this.DataList.filter(item => item.estado === 1).length;
  }

  GetRefuseCount(): number {
    return this.DataList.filter(item => item.estado === 0).length;
  }


}
