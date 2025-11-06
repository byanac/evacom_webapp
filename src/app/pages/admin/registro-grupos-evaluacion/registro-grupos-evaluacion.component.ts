import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvalgroupsCRUDService } from 'src/app/services/evalgroupsCRUD/evalgroups-crud.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/auth/login.service';
import { IEvaluationsGroupReport } from 'src/app/interfaces/IEvaluationsGroupReport';
import { IRegisterEvaluationGroup } from 'src/app/interfaces/IRegisterEvaluationGroup';

interface GrupoEvaluacion {
  codigo: string;
  descripcion: string,
  estado: number
}

@Component({
  selector: 'app-registro-grupos-evaluacion',
  templateUrl: './registro-grupos-evaluacion.component.html',
  styleUrls: ['./registro-grupos-evaluacion.component.css']
})
export class RegistroGruposEvaluacionComponent implements OnInit {
  editingGrupo: boolean = false;

  form: FormGroup;
  AdminData: any = this.loginService.GetUserSession();
  gruposEvaluacion: IEvaluationsGroupReport[] = []
  
  editingItem: GrupoEvaluacion | null = null;
  displayedColumns: string[] = ['codigo', 'descripcion','ultimamodific','adminmodific', 'estado', 'acciones'];
  dataSourceGroupEvaluacion = new MatTableDataSource<any>(this.gruposEvaluacion);
  @ViewChild('paginatorEvalGroups') paginatorEvalGroups: MatPaginator;

  constructor(public fb: FormBuilder, private utilsService: UtilsService, private AsignationEvalGroupsService: EvalgroupsCRUDService, private loginService: LoginService) {}

  async ngOnInit(): Promise<any> {
    this.initForm();
    this.LoadEvalGroupsData();
  }

  ngAfterViewInit(): void {
    this.dataSourceGroupEvaluacion.paginator = this.paginatorEvalGroups;
  }
  
  async LoadEvalGroupsData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalgroup = await this.AsignationEvalGroupsService.GetEvalGroupsReportCRUD().toPromise();
      const filteredEvalGroup = evalgroup.registros.sort((a: any, b: any) => b.estado - a.estado);
      this.gruposEvaluacion = filteredEvalGroup;
      this.dataSourceGroupEvaluacion.data = this.gruposEvaluacion;
      ////console.log(this.gruposEvaluacion)
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos','Por favor, inténtalo de nuevo más tarde.',"error");
    } 
  }
  

  initForm() {
    this.form = this.fb.group({
      codigo: [{ value: '', disabled: false }, Validators.required],
      descripcion: [{ value: '', disabled: true }, Validators.required],
    });
  
    this.form.get('codigo').valueChanges.subscribe(value => {
      if (value !== '') {
        this.form.get('descripcion').enable();
      } else {
        this.form.get('descripcion').disable();
      }
    });

  }

  handleSubmit() {
    if (this.form.valid) {
      const newGrupoEvaluacion: GrupoEvaluacion = this.form.getRawValue();
  
      if (this.editingItem) {
        ////console.log('editando')
        ////console.log(newGrupoEvaluacion)        
        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas editar el registro del grupo de evaluación?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "Editar",
          cancelButtonText: "Cancelar"
        }).then(async (result) => {
          if (result.value) {
              this.utilsService.showLoading();
              let bodyToSend: IRegisterEvaluationGroup = 
              {
                codigo: newGrupoEvaluacion.codigo,
                descripcion: newGrupoEvaluacion.descripcion,
                estado: 1,
                admin: {
                  codigoFicha: this.AdminData.ficha
                }
              }

              this.utilsService.showLoading();
              this.AsignationEvalGroupsService.PutEvalGroupsCRUD(bodyToSend).subscribe({
                next: (data) => {
                  Swal.fire({
                    title:  `El grupo de evaluación se ha editado con éxito`,
                    text: ``,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                  }).then(() => {
                    this.LoadEvalGroupsData();
                    this.form.markAsTouched();;
                    this.form.reset();
                    Object.keys(this.form.controls).forEach(key => {
                      this.form.get(key).setErrors(null);
                    });     
                    this.editingItem = null;
                  })
                },
                error: (error) => {
                  Swal.fire({
                    title:  "Ocurrió un error :(",
                    text: error.message,
                    type: 'error',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                  });
                }
              });           
          }
        })  

      } else {

        const foundedSameItemID = this.gruposEvaluacion.some(GroupEval => GroupEval.codigo.toUpperCase() === this.form.get('codigo').value.toUpperCase());
        if (foundedSameItemID) {
          return Swal.fire('ID Duplicado', 'Ya existe el ID del grupo de evaluación.', 'warning');
        }
        
        if(newGrupoEvaluacion.codigo !== null || newGrupoEvaluacion.descripcion !== null){
          ////console.log(newGrupoEvaluacion)  
          Swal.fire({
            title:  "Aviso",
            text: `¿Estás seguro de que deseas añadir el registro del grupo de evaluación?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Añadir",
            cancelButtonText: "Cancelar"
          }).then(async (result) => {
            if (result.value) {
                this.utilsService.showLoading();
                let bodyToSend: IRegisterEvaluationGroup = 
                {
                  codigo: newGrupoEvaluacion.codigo,
                  descripcion: newGrupoEvaluacion.descripcion,
                  admin: {
                    codigoFicha: this.AdminData.ficha
                  }
                }

                this.utilsService.showLoading();
                this.AsignationEvalGroupsService.PostEvalGroupsCRUD(bodyToSend).subscribe({
                  next: (data) => {
                    Swal.fire({
                      title:  `El grupo de evaluación se ha añadido con éxito`,
                      text: ``,
                      type: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'OK',
                    }).then(() => {
                      this.LoadEvalGroupsData();
                      this.form.markAsTouched();;
                      this.form.reset();
                      Object.keys(this.form.controls).forEach(key => {
                        this.form.get(key).setErrors(null);
                      });     
                    })
                  },
                  error: (error) => {
                    Swal.fire({
                      title:  "Ocurrió un error :(",
                      text: error.message,
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'OK',
                    });
                  }
                });           
            }
          })  
        }
      }

    }
    this.editingGrupo=false;
  }
  

  handleEdit(registro: any) {
    this.editingGrupo=true;
    this.editingItem = registro;
    ////console.log(registro)
    this.form.get('codigo').disable();
    this.form.get('codigo').patchValue(registro.codigo);
    this.form.get('descripcion').patchValue(registro.descripcion);
  }

  handleDelete(registro: any) {
    let bodyToSend: IRegisterEvaluationGroup = 
    {
      codigo: registro.codigo,
      descripcion: registro.descripcion,
      estado: 0,
      admin: {
        codigoFicha: this.AdminData.ficha
      }
    }
    ////console.log(BodyToSend)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el grupo de evaluación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.AsignationEvalGroupsService.PutEvalGroupsCRUD(bodyToSend).subscribe({
          next: (data) => {
            Swal.fire({
              title:  `El grupo de evaluación se ha eliminado con éxito`,
              text: ``,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              this.LoadEvalGroupsData();   
              this.editingItem = null;
              this.form.reset() 
              Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).setErrors(null);
              });
            })
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error :(",
              text:  "No se puede inactivar el grupo valide si ya tiene asignaciones",
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
          }
        });
      }
    })
  }

  handleActivate(registro: any) {
    ////console.log(registro)
    let bodyToSend: IRegisterEvaluationGroup = 
    {
      codigo: registro.codigo,
      descripcion: registro.descripcion,
      estado: 1,
      admin: {
        codigoFicha: this.AdminData.ficha
      }
    }
    ////console.log(BodyToSend)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar el grupo de evaluación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.AsignationEvalGroupsService.PutEvalGroupsCRUD(bodyToSend).subscribe({
          next: (data) => {
            Swal.fire({
              title:  `El grupo de evaluación se ha activado con éxito`,
              text: ``,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              this.LoadEvalGroupsData();    
            })
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error",
              text: error.message,
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            });
          }
        });
      }
    })
  }

  async cancelGrupoEval(): Promise<any>{
   // this.resetForm();
    this.initForm();
    this.LoadEvalGroupsData();
    this.editingGrupo = false;
  }
}
