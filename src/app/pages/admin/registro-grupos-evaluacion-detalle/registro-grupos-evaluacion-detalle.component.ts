import { IRegisterEvaluationGroupDetail } from './../../../interfaces/IRegisterEvaluationGroupDetail';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EvalgroupsCRUDService } from 'src/app/services/evalgroupsCRUD/evalgroups-crud.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorsCatalogService } from 'src/app/services/behaviors-catalog/behaviors-catalog.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { ICompetencyGroup } from 'src/app/interfaces/Calendar/ICompetencyGroup';
import { ICompetency } from 'src/app/interfaces/Calendar/ICompetency';
import { ILevel } from 'src/app/interfaces/Calendar/ILevel';
import { IEvaluationsGroupDetailReport } from 'src/app/interfaces/IEvaluationsGroupDetailReport';


@Component({
  selector: 'app-registro-grupos-evaluacion-detalle',
  templateUrl: './registro-grupos-evaluacion-detalle.component.html',
  styleUrls: ['./registro-grupos-evaluacion-detalle.component.css']
})

export class RegistroGruposEvaluacionDetalleComponent implements OnInit {
  editingDetalle: boolean = false;
  form: FormGroup;
  AdminData: any = this.loginService.GetUserSession();
  gruposCompetencias: ICompetencyGroup[] = [];
  competencias: ICompetency[] = [];
  niveles: ILevel[] = [];
  gruposEvaluacionDetail: IEvaluationsGroupDetailReport[] = [];
  gruposEvaluacion: any[] = [];
  dataSourceGroupEvaluacionDetalle = new MatTableDataSource<any>(this.gruposEvaluacionDetail);
  @ViewChild('paginatorEvalGroupsDetail') paginatorEvalGroupsDetalle: MatPaginator;
  filteredCompetencias: ICompetency[] = [];
  editingItem: ICompetencyGroup | null = null;
  displayedColumns: string[] = ['grupoeval', 'codigocompetencia','grupocompetencia', 'nivel','ultimamodific','adminmodific', 'estado', 'acciones'];

  constructor(public fb: FormBuilder, private utilsService: UtilsService, private AsignationEvalGroupsService: EvalgroupsCRUDService, private behaviorsCatalogService: BehaviorsCatalogService, private loginService: LoginService) {}

  async ngOnInit(): Promise<any> {
    this.initForm();
    await this.LoadEvalGroupsData();
    await this.LoadCompetencyData();
    await this.LoadLevelsData();
    await this.LoadEvalGroupsDetailData();
  }
  
  ngAfterViewInit(): void {
    this.dataSourceGroupEvaluacionDetalle.paginator = this.paginatorEvalGroupsDetalle;
  }

  initForm(): void {
    this.form = this.fb.group({
      idGrupoEvaluacion: [{ value: '', disabled: false }, Validators.required],
      idGrupoCompetencia: [{ value: '', disabled: true }, Validators.required],
      idNivelCompetencia: [{ value: '', disabled: true }, Validators.required],
      idGrupoEvaluacionDetalle: [{ value: '', disabled: true }],
    });
    
    this.form.get('idGrupoEvaluacion').valueChanges.subscribe(value => {
      if (value) {
        this.form.get('idGrupoCompetencia').enable(); 
      } else {
        this.resetAndDisable(['idGrupoCompetencia', 'idNivelCompetencia']); 
      }
    });
    
    this.form.get('idGrupoCompetencia').valueChanges.subscribe(value => {
      if (value) {
        this.form.get('idNivelCompetencia').enable(); 
      } else {
        this.resetAndDisable(['idNivelCompetencia']);
      }
    });
    
  }
  
  resetAndDisable(controls: string[]): void {
    controls.forEach(controlName => {
      const control = this.form.get(controlName);
      if (control) {
        control.reset();
        control.disable();
      }
    });
  }
  
  async LoadEvalGroupsData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalgroup = await this.AsignationEvalGroupsService.GetEvalGroupsReportCRUD().toPromise();
      this.gruposEvaluacion = evalgroup.registros.filter((data: { estado: number; }) => data.estado === 1);
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de grupos de evaluación','Por favor, inténtalo de nuevo más tarde.',"error");
    } 
  }

  async LoadCompetencyData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const competency = await this.behaviorsCatalogService.GetCompetenciesReport().toPromise();
      this.competencias = competency.registros.filter((competencia: { estado: number; }) => competencia.estado === 1);
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar las competencias:', error);
      return Swal.fire('Error al cargar los datos de Competencias', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

  async LoadLevelsData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const levels = await this.behaviorsCatalogService.GetLevelsReport().toPromise();
      this.niveles = levels.registros.filter(nivel => nivel.estado === 1);
      //console.log(this.niveles)
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los niveles:', error);
      return Swal.fire('Error al cargar los datos de Niveles', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

  async LoadEvalGroupsDetailData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalgroupdetail = await this.AsignationEvalGroupsService.GetEvalGroupsDetailReportCRUD().toPromise();
      const filteredEvalGroupDetail = evalgroupdetail.registros.sort((a: any, b: any) => b.estado - a.estado);
      this.gruposEvaluacionDetail = filteredEvalGroupDetail;
      this.dataSourceGroupEvaluacionDetalle.data = this.gruposEvaluacionDetail;
      ////console.log(this.gruposEvaluacionDetail)
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de detalle de grupos de evaluacióm','Por favor, inténtalo de nuevo más tarde.',"error");
    } 
  }
  
  handleSubmit() {
    if (this.form.valid) {
      const newGrupoEvaluacionDetalle: any = this.form.getRawValue();

      const yaExiste = this.gruposEvaluacionDetail.some(grupoEvalDetalle =>
        grupoEvalDetalle.grupoEvaluacion.codigo === newGrupoEvaluacionDetalle.idGrupoEvaluacion &&
        grupoEvalDetalle.competencia.codigo === newGrupoEvaluacionDetalle.idGrupoCompetencia &&
        grupoEvalDetalle.nivel.codigo === newGrupoEvaluacionDetalle.idNivelCompetencia         
      );

      if (yaExiste) {
        Swal.fire('Registro duplicado', 'Ya existe un registro con el mismo grupo de evaluación, competencia y nivel.', 'warning');
        return;
      }


      //console.log(newGrupoEvaluacionDetalle)
      if (this.editingItem) {
        //console.log(newGrupoEvaluacionDetalle)
        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas editar el registro de detalle del grupo de evaluación?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "Editar",
          cancelButtonText: "Cancelar"
        }).then(async (result) => {
          if (result.value) {
              this.utilsService.showLoading();
              let bodyToSend: IRegisterEvaluationGroupDetail = 
              {
                idGrupoEvaluacionDetalle: newGrupoEvaluacionDetalle.idGrupoEvaluacionDetalle,
                grupoEvaluacion: {
                  codigo: newGrupoEvaluacionDetalle.idGrupoEvaluacion
                },
                competencia: {
                  codigo: newGrupoEvaluacionDetalle.idGrupoCompetencia
                },
                nivel: {
                  codigo: newGrupoEvaluacionDetalle.idNivelCompetencia
                },
                estado: 1,
                admin: {
                  codigoFicha: this.AdminData.ficha
                }
              }
              //console.log(bodyToSend)
              this.utilsService.showLoading();
              this.AsignationEvalGroupsService.PutEvalGroupsDetailCRUD(bodyToSend).subscribe({
                next: (data) => {
                  Swal.fire({
                    title:  `El detalle del grupo de evaluación se ha editado con éxito`,
                    text: ``,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                  }).then(() => {
                    this.LoadEvalGroupsDetailData();
                    this.form.markAsTouched();;
                    this.form.reset();
                    this.editingItem = null;
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
  
      } else {
        if(newGrupoEvaluacionDetalle.idGrupoCompetencia !== null || 
          newGrupoEvaluacionDetalle.idGrupoEvaluacion !== null ||
           newGrupoEvaluacionDetalle.idGrupoEvaluacionDetalle !== null || 
           newGrupoEvaluacionDetalle.idNivelCompetencia !== null){
          Swal.fire({
            title:  "Aviso",
            text: `¿Estás seguro de que deseas añadir el registro de detalle del grupo de evaluación?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Añadir",
            cancelButtonText: "Cancelar"
          }).then(async (result) => {
            if (result.value) {
                this.utilsService.showLoading();
                let bodyToSend: IRegisterEvaluationGroupDetail = 
                {
                  grupoEvaluacion: {
                    codigo: newGrupoEvaluacionDetalle.idGrupoEvaluacion
                  },
                  competencia: {
                    codigo: newGrupoEvaluacionDetalle.idGrupoCompetencia
                  },
                  nivel: {
                    codigo: newGrupoEvaluacionDetalle.idNivelCompetencia
                  },
                  admin: {
                    codigoFicha: this.AdminData.ficha
                  }
                }
                //console.log(bodyToSend)
                this.utilsService.showLoading();
                this.AsignationEvalGroupsService.PostEvalGroupsDetailCRUD(bodyToSend).subscribe({
                  next: (data) => {
                    Swal.fire({
                      title:  `El detalle del grupo de evaluación se ha añadido con éxito`,
                      text: ``,
                      type: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'OK',
                    }).then(() => {
                      this.LoadEvalGroupsDetailData();
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
    this.editingDetalle=false;
  }

    async cancelGrupoEvalDetalle(): Promise<any>{
   // this.resetForm();
    this.initForm();
    this.LoadEvalGroupsData();
     this.editingItem = null;
    this.editingDetalle = false;
  }

  handleEdit(grupoEvaluacion: any) {
    this.editingItem = grupoEvaluacion;
    this.editingDetalle=true;
    this.form.get('idGrupoEvaluacion').setValue(grupoEvaluacion.grupoEvaluacion.codigo);
    this.form.get('idGrupoCompetencia').setValue(grupoEvaluacion.competencia.codigo);
    this.form.get('idNivelCompetencia').setValue(grupoEvaluacion.nivel.codigo);
    this.form.get('idGrupoEvaluacionDetalle').setValue(grupoEvaluacion.idGrupoEvaluacionDetalle)
  }
  
  
  handleDelete(GrupoEvaluacionDetalle: any) {
    //console.log(GrupoEvaluacionDetalle)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el registro de detalle del grupo de evaluación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          let bodyToSend: IRegisterEvaluationGroupDetail = 
          {
            idGrupoEvaluacionDetalle: GrupoEvaluacionDetalle.idGrupoEvaluacionDetalle,
            grupoEvaluacion: {
              codigo: GrupoEvaluacionDetalle.grupoEvaluacion.codigo
            },
            competencia: {
              codigo: GrupoEvaluacionDetalle.competencia.codigo
            },
            nivel: {
              codigo: GrupoEvaluacionDetalle.nivel.codigo
            },
            estado: 0,
            admin: {
              codigoFicha: this.AdminData.ficha
            }
          }
          //console.log(bodyToSend)
          this.utilsService.showLoading();
          this.AsignationEvalGroupsService.PutEvalGroupsDetailCRUD(bodyToSend).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `El detalle del grupo de evaluación se ha eliminado con éxito`,
                text: ``,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then(() => {
                this.LoadEvalGroupsDetailData();
                this.form.markAsTouched();;
                this.form.reset();
                this.editingItem = null;
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

  handleActivate(GrupoEvaluacionDetalle: any) {
    //console.log(GrupoEvaluacionDetalle)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar el registro de detalle del grupo de evaluación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          let bodyToSend: IRegisterEvaluationGroupDetail = 
          {
            idGrupoEvaluacionDetalle: GrupoEvaluacionDetalle.idGrupoEvaluacionDetalle,
            grupoEvaluacion: {
              codigo: GrupoEvaluacionDetalle.grupoEvaluacion.codigo
            },
            competencia: {
              codigo: GrupoEvaluacionDetalle.competencia.codigo
            },
            nivel: {
              codigo: GrupoEvaluacionDetalle.nivel.codigo
            },
            estado: 1,
            admin: {
              codigoFicha: this.AdminData.ficha
            }
          }
          //console.log(bodyToSend)
          this.utilsService.showLoading();
          this.AsignationEvalGroupsService.PutEvalGroupsDetailCRUD(bodyToSend).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `El detalle del grupo de evaluación se ha activado con éxito`,
                text: ``,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then(() => {
                this.LoadEvalGroupsDetailData();
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
