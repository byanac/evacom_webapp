import { Component, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IRegisterAdmin } from 'src/app/interfaces/IRegisterAdmin';
import { ISearchWorkerData } from 'src/app/interfaces/ISearchWorkerData';
import { AdminService } from 'src/app/services/admin/admin.service';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registeradministratormodal',
  templateUrl: './registeradministratormodal.component.html',
  styleUrls: ['./registeradministratormodal.component.css']
})
export class RegisteradministratormodalComponent implements OnInit {
  adminForm: FormGroup;
  @Output() close = new EventEmitter<boolean>();
  UserData: ISearchWorkerData = null;
  roles: string[] = ['Super Administrador', 'Administrador', 'Editor'];

  constructor(private fb: FormBuilder,private renderer: Renderer2,public ConfigurationService: ConfigurationService, private adminService: AdminService, private utilService: UtilsService) {}

  ngOnInit() {
    this.adminForm = this.fb.group({
      adminCode: ['', Validators.required],
      name: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      puesto: [{ value: '', disabled: true }, Validators.required],
      isActive: [{ value: false }]
    });
  }

  async SearchWorker(): Promise<void>{
    if(this.adminForm.get('adminCode').value !== ''){
      this.utilService.showLoading();
      const userAdmin=JSON.parse(sessionStorage.getItem('userdata')).ficha;
      const data:any = await this.adminService.GetWorkerInfoForRegisterAdminModal(this.adminForm.get('adminCode').value).toPromise()
      if(data.registros.codigoFicha){
        this.UserData = data.registros
        //console.log(this.UserData)
        this.adminForm.get('name').patchValue(this.UserData.apellidosNombres)
        this.adminForm.get('email').patchValue(this.UserData.correo)
        this.adminForm.get('puesto').patchValue(this.UserData.nombrePuesto)
        this.utilService.closeLoading();
      }else{
        Swal.fire("ERROR", "La ficha ingresada no existe", "error");
        this.UserData = null;
        this.adminForm.get('name').patchValue('');
        this.adminForm.get('email').patchValue('');
        this.adminForm.get('puesto').patchValue('');
      }   
    }else{
      Swal.fire("ALERTA","Por favor, completa el campo de ficha para continuar.",'warning')
    }
 
  }

  onSubmit() {
    if (this.adminForm.valid && this.UserData !== null) {
      let BodyToSend: IRegisterAdmin = {
        codigoFicha: this.UserData.codigoFicha,
        estado: this.adminForm.get('isActive').value ? 1 : 0
      }
      //console.log(BodyToSend)
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas registrar como administador al trabajador: ${this.UserData.apellidosNombres}?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Registrar',
        cancelButtonText: "Cancelar"
      }).then((result) => {
        if (result.value) {
          this.utilService.showLoading();
          this.adminService.PostSaveAdmin(BodyToSend)
          .subscribe({
            next: (data) => {
              Swal.fire("El administrador ha sido registrado exitosamente.", "","success").then(() => {
                this.CloseModal()
              });
            },
            error: (error) => {
              console.error("Error:", error.message);
              Swal.fire("Error al registrar al administrador",'',"error");
            }
          });
          }
      });   
    } else {
      Swal.fire("ALERTA","Por favor, completa todos los campos para continuar.",'warning')
    }
  }

  CloseModal(): void{
    this.ConfigurationService.getStaticMenuDeactivated().subscribe(data => {
      data ? this.renderer.setStyle(document.body, 'overflow-y', 'auto') : ''
      this.close.emit(false);
    })
  }
}
