import { UtilsService } from 'src/app/services/utils/utils.service';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorsCatalogService } from 'src/app/services/behaviors-catalog/behaviors-catalog.service';
import { CompetencyErrors } from 'src/app/core/masiveexcelerrorsconst/CompetencyErrors';
import { BehaviorsErrors } from 'src/app/core/masiveexcelerrorsconst/BehaviorsErrors';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LoginService } from 'src/app/services/auth/login.service';
import { ICompetencyGroup } from 'src/app/interfaces/Calendar/ICompetencyGroup';
import { ICompetency } from 'src/app/interfaces/Calendar/ICompetency';
import { ILevel } from 'src/app/interfaces/Calendar/ILevel';
import { IBehavior} from 'src/app/interfaces/Calendar/IBehavior';
import { ICompetencyValidateMasive } from 'src/app/interfaces/ICompetencyValidateMasive';
import { IBehaviorsValidateMasive } from 'src/app/interfaces/IBehaviorsValidateMasive';
import { IRegisterCompetencyGroup } from 'src/app/interfaces/IRegisterCompetencyGroup';
import { IRegisterCompetency } from 'src/app/interfaces/IRegisterCompetency';
import { IRegisterLevels } from 'src/app/interfaces/IRegisterLevels';
import { IRegisterBehaviors } from 'src/app/interfaces/IRegisterBehaviors';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-catalogo-competencias',
  templateUrl: './registro-catalogo-competencias.component.html',
  styleUrls: ['./registro-catalogo-competencias.component.css']
})
export class RegistroCatalogoCompetenciasComponent implements OnInit, AfterViewInit {
  AdminData: any = this.loginService.GetUserSession()
  grupoCompetenciaForm: FormGroup;
  competenciaForm: FormGroup;
  nivelForm: FormGroup;
  comportamientoForm: FormGroup;
  editingCompetencyGroups: boolean = false;
  editingCompetency: boolean = false;
  editingLevel: boolean = false;
  editingBehaviors: boolean = false;
  CompetencyErrors = CompetencyErrors
  BehaviorErrors = BehaviorsErrors

  @ViewChild('dialogContent') dialogContent: TemplateRef<any>;
  @ViewChild('UploadExcelBehaviorsDialog') UploadExcelBehaviorsDialog: TemplateRef<any>;
  @ViewChild('paginatorGrupos') paginatorGrupos: MatPaginator;
  @ViewChild('paginatorCompetencias') paginatorCompetencias: MatPaginator;
  @ViewChild('paginatorNiveles') paginatorNiveles: MatPaginator;
  @ViewChild('paginatorComportamientos') paginatorComportamientos: MatPaginator;

  displayedColumns: string[] = ['codigo', 'descripcion','ultimamodific','adminmodific','estado', 'acciones'];
  displayedColumns2: string[] = ['codigo', 'titulo', 'codigoGrupo', 'grupocompetencia','ultimamodific','adminmodific','estado','acciones'];
  displayedColumns3: string[] = ['codigo', 'nombre','ultimamodific','adminmodific','estado','acciones'];
  displayedColumns4: string[] = ['codigo','codigoCompetencia','competencia','nivel','ultimamodific','adminmodific','estado','acciones'];
  displayedColumnsCompetencyModal: string[] = ['codigo', 'titulo','descripcion', 'grupocompetencia', 'mensajeserror'];
  displayedColumnsBehaviorsGroupModal: string[] = ['codigo','codigoCompetencia','competencia','nivel','mensajeserror'];

  gruposCompetencias: ICompetencyGroup[] = [];
  competencias: ICompetency[] = [];
  niveles: ILevel[] = [];
  comportamientos: IBehavior[] = [];

  competenciasExcel: ICompetencyValidateMasive = null;
  comportamientoExcel: IBehaviorsValidateMasive = null;

  gruposCompetenciasActivos: ICompetencyGroup[] = [];
  CompetenciasActivos: ICompetency[] = [];
  NivelesActivos: ILevel[] = [];
  ComportamientosActivos: IBehavior[] = [];

  dataSourceGruposCompetencia = new MatTableDataSource<any>(this.gruposCompetencias);
  dataSourceCompetencias = new MatTableDataSource<any>(this.competencias);
  dataSourceNiveles = new MatTableDataSource<any>(this.niveles);
  dataSourceComportamientos = new MatTableDataSource<any>(this.comportamientos);

  constructor(private fb: FormBuilder, public dialog: MatDialog, private behaviorsCatalogService: BehaviorsCatalogService, private utilsService: UtilsService, private loginService: LoginService) {}

  async ngOnInit(): Promise<void> {
    this.grupoCompetenciaForm = this.fb.group({
      codigo: ['', Validators],
      descripcion: ['', Validators],
      estado: [0]
    });

    this.competenciaForm = this.fb.group({
      codigo: ['', Validators],
      titulo: ['', Validators],
      descripcion: ['', Validators],
      grupo: this.fb.group({
        codigo: ['', Validators]
      }),
      estado: [0]
    });
    
    this.nivelForm = this.fb.group({
      codigo: ['', Validators],
      nombre: ['', Validators],
      estado: [0]
    });

    this.comportamientoForm = this.fb.group({
      codigo: ['', Validators],
      descripcion: ['', Validators],
      estado: [0],
      competencia: this.fb.group({
        codigo: ['', Validators]
      }),
      nivel: this.fb.group({
        codigo: ['', Validators]
      }),
    });

    await this.LoadCompetencyGroupsData();
    await this.LoadCompetencyData();
    await this.LoadLevelsData();
    await this.LoadBehaviorsData();
  }

  ngAfterViewInit() {
    this.dataSourceGruposCompetencia.paginator = this.paginatorGrupos;
    this.dataSourceCompetencias.paginator = this.paginatorCompetencias;
    this.dataSourceNiveles.paginator = this.paginatorNiveles;
    this.dataSourceComportamientos.paginator = this.paginatorComportamientos;
  }

  async LoadCompetencyGroupsData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const competencygroups = await this.behaviorsCatalogService.GetCompetenciesGroupReport().toPromise();
      const filteredCompetencygroups = competencygroups.registros.sort((a: any, b: any) => b.estado - a.estado);
      this.gruposCompetencias = filteredCompetencygroups;
      this.dataSourceGruposCompetencia.data = this.gruposCompetencias;
      this.gruposCompetenciasActivos = this.gruposCompetencias.filter(grupo => grupo.estado === 1);
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los grupos de competencias:', error);
      return Swal.fire('Error al cargar los datos de grupos de Competencias', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

  async LoadCompetencyData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const competency = await this.behaviorsCatalogService.GetCompetenciesReport().toPromise();
      const filteredCompetency = competency.registros.sort((a: any, b: any) => b.estado - a.estado);
      this.competencias = filteredCompetency;
      this.dataSourceCompetencias.data = this.competencias;
      this.CompetenciasActivos = this.competencias.filter(competencia => competencia.estado === 1);
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
      const filteredLevels = levels.registros.sort((a: any, b: any) => b.estado - a.estado);
      this.niveles = filteredLevels;
      this.dataSourceNiveles.data = this.niveles;
      this.NivelesActivos = this.niveles.filter(nivel => nivel.estado === 1);
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los niveles:', error);
      return Swal.fire('Error al cargar los datos de Niveles', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

  async LoadBehaviorsData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const behaviors = await this.behaviorsCatalogService.GetBehaviorsReport().toPromise();
      const filteredBehaviors = behaviors.registros.sort((a: any, b: any) => b.estado - a.estado);
      this.comportamientos = filteredBehaviors;
      this.dataSourceComportamientos.data = this.comportamientos;
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los comportamientos:', error);
      return Swal.fire('Error al cargar los datos de Comportamientos', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

  openUploadExcelCompetencyDialog(): void {
    this.dialog.open(this.dialogContent, {
      width: '1600px'
    });
  }

  openUploadExcelComportamientoDialog(): void {
    this.dialog.open(this.UploadExcelBehaviorsDialog, {
      width: '1600px'
    });
  }

  private resetForm(): void {
    this.grupoCompetenciaForm.reset();
    this.grupoCompetenciaForm.markAsTouched();
    this.competenciaForm.reset();
    this.competenciaForm.markAsUntouched();
    this.nivelForm.reset();
    this.nivelForm.markAsUntouched();
    this.comportamientoForm.reset();
    this.comportamientoForm.markAsUntouched();
  }
  
  async onSubmit(formName: string): Promise<any> {
    debugger
    switch (formName) {
      case 'grupoCompetencia':

            if (this.grupoCompetenciaForm.get('codigo').value === '' || this.grupoCompetenciaForm.get('codigo').value === null) {
              return Swal.fire('Campo Código Vacío', 'Por favor, complete el campo de código antes de continuar.', 'warning');
            }

            if (this.grupoCompetenciaForm.get('descripcion').value === '' || this.grupoCompetenciaForm.get('descripcion').value === null) {
              return Swal.fire('Campo Descripción Vacío', 'Por favor, complete el campo de descripción antes de continuar.', 'warning');
            }
            
            debugger
            const foundedSameItemID = this.gruposCompetencias.some(ComGroup => ComGroup.codigo.toUpperCase() === this.grupoCompetenciaForm.get('codigo').value.toUpperCase());
            if (foundedSameItemID) {
              return Swal.fire('ID Duplicado', 'Ya existe el ID del grupo de competencia.', 'warning');
            }
            
            Swal.fire({
              title:  "Aviso",
              text: `¿Estás seguro de que deseas añadir el grupo de competencia?`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: "Añadir",
              cancelButtonText: "Cancelar"
            }).then(async (result) => {
              if (result.value) {
                this.utilsService.showLoading();
                    try {
                      let grupoCompetenciaFormValue: IRegisterCompetencyGroup = this.grupoCompetenciaForm.value
                      delete grupoCompetenciaFormValue.estado
                      let admin = {codigoFicha:this.AdminData.ficha};
                      grupoCompetenciaFormValue.admin = admin;
                      //console.log(grupoCompetenciaFormValue)
                      const response = await this.behaviorsCatalogService.PostCompetenciesGroup(grupoCompetenciaFormValue).toPromise();
                      if (response) {
                        Swal.fire(
                           "Éxito",
                           "El grupo de competencia se añadió correctamente.",
                          "success"
                        ).then(() => {
                           this.LoadCompetencyGroupsData();
                           this.resetForm();
                           this.editingCompetencyGroups = false;
                           Object.keys(this.grupoCompetenciaForm.controls).forEach(key => {
                             this.grupoCompetenciaForm.get(key).setErrors(null);
                           });
                        });
                      }
                    } catch (error) {
                      console.error("Error al añadir el grupo de competencia:", error);
                      Swal.fire(
                      "Error",
                      "Ocurrió un error al añadir el grupo de competencia. Por favor, inténtalo de nuevo.",
                      "error"
                      );
                    } 
                  
                 
                  }  
            })

        break;
      case 'competencia':
      
          if (this.competenciaForm.get('codigo').value === '' || this.competenciaForm.get('codigo').value === null) {
            return Swal.fire('Campo Código Vacío', 'Por favor, complete el campo de código antes de continuar.', 'warning');
          }

          if (this.competenciaForm.get('titulo').value === '' || this.competenciaForm.get('titulo').value === null) {
            return Swal.fire('Campo Título Vacío', 'Por favor, complete el campo de título antes de continuar.', 'warning');
          }

          if (this.competenciaForm.get('descripcion').value === '' || this.competenciaForm.get('descripcion').value === null) {
            return Swal.fire('Campo Descripción Vacío', 'Por favor, complete el campo de descripción antes de continuar.', 'warning');
          }

          if (this.competenciaForm.get('grupo.codigo').value === '' || this.competenciaForm.get('descripcion').value === null) {
            return Swal.fire('Campo Grupo Vacío', 'Por favor, complete el campo de grupo de competencia antes de continuar.', 'warning');
          }
       
          const foundedSameItemIDCom = this.competencias.some(Com => Com.codigo.toUpperCase() === this.competenciaForm.get('codigo').value.toUpperCase());
          if (foundedSameItemIDCom) {
            return Swal.fire('ID Duplicado', 'Ya existe el ID de competencia.', 'warning');
          }

          Swal.fire({
            title:  "Aviso",
            text: `¿Estás seguro de que deseas añadir la competencia?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Añadir",
            cancelButtonText: "Cancelar"
          }).then(async (result) => {
            if (result.value) {
                  try {
                    this.utilsService.showLoading();
                    let CompetenciaFormValue: IRegisterCompetency = this.competenciaForm.value;
                    delete CompetenciaFormValue.estado;
                    let admin = {codigoFicha:this.AdminData.ficha};
                    CompetenciaFormValue.admin = admin;
                    //console.log(CompetenciaFormValue);
                    const response = await this.behaviorsCatalogService.PostCompetencies(CompetenciaFormValue).toPromise();
                    if (response) {
                      Swal.fire(
                         "Éxito",
                         "La competencia se añadió correctamente.",
                        "success"
                      ).then(() => {
                         this.LoadCompetencyData();
                         this.resetForm();
                         this.editingCompetencyGroups = false;
                         Object.keys(this.competenciaForm.controls).forEach(key => {
                           this.competenciaForm.get(key).setErrors(null);
                         });
                      });
                    }
                  } catch (error) {
                    console.error("Error al añadir la competencia:", error);
                    Swal.fire(
                    "Error",
                    "Ocurrió un error al añadir la competencia. Por favor, inténtalo de nuevo.",
                    "error"
                    );
                  } 
                } 
          })
        break;
      case 'nivel':
        if (this.nivelForm.get('codigo').value === '' || this.nivelForm.get('codigo').value === null) {
          return Swal.fire('Campo Código Vacío', 'Por favor, complete el campo de código antes de continuar.', 'warning');
        }

        if (this.nivelForm.get('nombre').value === '' || this.nivelForm.get('nombre').value === null) {
          return Swal.fire('Campo Nombre Vacío', 'Por favor, complete el campo de nombre antes de continuar.', 'warning');
        }
        debugger
        const foundedSameItemIDNivel = this.niveles.some(Niv => Niv.codigo.toUpperCase() === this.nivelForm.get('codigo').value.toUpperCase());
        if (foundedSameItemIDNivel) {
          return Swal.fire('ID Duplicado', 'Ya existe el ID de nivel.', 'warning');
        }

        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas añadir el nivel?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "Añadir",
          cancelButtonText: "Cancelar"
        }).then(async (result) => {
          if (result.value) {      
                try {
                  this.utilsService.showLoading();
                  let nivelFormValue:IRegisterLevels = this.nivelForm.value
                  delete nivelFormValue.estado
                  let admin = {codigoFicha:this.AdminData.ficha};
                  nivelFormValue.admin = admin;
                  //console.log(nivelFormValue)
                  const response = await this.behaviorsCatalogService.PostLevels(nivelFormValue).toPromise();
                  if (response) {
                    Swal.fire(
                       "Éxito",
                       "La competencia se añadió correctamente.",
                      "success"
                    ).then(() => {
                       this.LoadLevelsData();
                       this.resetForm();
                       this.editingLevel = false;
                       Object.keys(this.nivelForm.controls).forEach(key => {
                         this.nivelForm.get(key).setErrors(null);
                       });
                    });
                  }
                } catch (error) {
                  console.error("Error al añadir la competencia:", error);
                  Swal.fire(
                  "Error",
                  "Ocurrió un error al añadir la competencia. Por favor, inténtalo de nuevo.",
                  "error"
                  );
                }         
               
          }
        })
        break;
      case 'comportamiento':
        if (this.comportamientoForm.get('codigo').value === '' || this.comportamientoForm.get('codigo').value === null) {
          return Swal.fire('Campo Código Vacío', 'Por favor, complete el campo de código antes de continuar.', 'warning');
        }

        if (this.comportamientoForm.get('descripcion').value === '' || this.comportamientoForm.get('descripcion').value === null) {
          return Swal.fire('Campo Descripción Vacío', 'Por favor, complete el campo de descripción antes de continuar.', 'warning');
        }

        if (this.comportamientoForm.get('competencia.codigo').value === '' || this.comportamientoForm.get('competencia.codigo').value === null) {
          return Swal.fire('Campo Competencia Vacío', 'Por favor, complete el campo de competencia antes de continuar.', 'warning');
        }

        if (this.comportamientoForm.get('nivel.codigo').value === '' || this.comportamientoForm.get('nivel.codigo').value === null) {
          return Swal.fire('Campo Nivel Vacío', 'Por favor, complete el campo de nivel antes de continuar.', 'warning');
        }

        //console.log(this.comportamientoForm.value)
     
        const foundedSameItemIDBehavior = this.comportamientos.some(Com => Com.codigo.toUpperCase() === this.comportamientoForm.get('codigo').value.toUpperCase());
        if (foundedSameItemIDBehavior) {
          return Swal.fire('ID Duplicado', 'Ya existe el ID del comportamiento.', 'warning');
        }

        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas añadir el comportamiento?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "Añadir",
          cancelButtonText: "Cancelar"
        }).then(async (result) => {
          if (result.value) {
                try {
                  this.utilsService.showLoading();
                  let ComportamientoaFormValue:IRegisterBehaviors = this.comportamientoForm.value
                  delete ComportamientoaFormValue.estado
                  let admin = {codigoFicha:this.AdminData.ficha};
                  ComportamientoaFormValue.admin = admin;
                  //console.log(ComportamientoaFormValue)
                  const response = await this.behaviorsCatalogService.PostBehaviorsReport(ComportamientoaFormValue).toPromise();
                  if (response) {
                    Swal.fire(
                       "Éxito",
                       "El comportamiento se añadió correctamente.",
                      "success"
                    ).then(() => {
                       this.LoadBehaviorsData();
                       this.resetForm();
                       this.editingBehaviors = false;
                       Object.keys(this.comportamientoForm.controls).forEach(key => {
                         this.comportamientoForm.get(key).setErrors(null);
                       });
                    });
                  }
                } catch (error) {
                  console.error("Error al añadir la comportamiento:", error);
                  Swal.fire(
                  "Error",
                  "Ocurrió un error al añadir el comportamiento. Por favor, inténtalo de nuevo.",
                  "error"
                  );
                }       
               
          }
        })
        break;
    }
  }

  handleCompetencyGroupsEdit(grupoCompetencia: any) {
    this.editingCompetencyGroups = true;
    this.grupoCompetenciaForm.patchValue(grupoCompetencia);
    this.grupoCompetenciaForm.get('codigo').disable();
  }

  async onEditCompetencyGroups(): Promise<void>{
    if(this.grupoCompetenciaForm.get('descripcion').value != ''){
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas editar el grupo de competencia?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Editar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.value) {
            this.utilsService.showLoading();
            try {
              let BodyToSend:IRegisterCompetencyGroup = this.grupoCompetenciaForm.getRawValue();
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutCompetenciesGroup(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                   "Éxito",
                   "El grupo de competencia se actualizó correctamente.",
                  "success"
                ).then(() => {
                   this.LoadCompetencyGroupsData();
                   this.grupoCompetenciaForm.get('codigo').enable();
                   this.editingCompetencyGroups = false;
                   this.resetForm();
                });
              }
            } catch (error) {
              console.error("Error al actualizar el grupo de competencia:", error);
              Swal.fire(
              "Error",
              "Ocurrió un error al actualizar el grupo de competencia. Por favor, inténtalo de nuevo.",
              "error"
              );
            }  
        }
      })
    

    }else{
      Swal.fire('Campo Descripción Vacío', 'Por favor, complete el campo de descripción antes de continuar.', 'warning')
    }
  }

  async onDeleteCompetencyGroups(grupoCompetencia: any): Promise<void>{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el grupo de competencia?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
            try {
              this.utilsService.showLoading();
              grupoCompetencia.estado = 0
              let BodyToSend:any = grupoCompetencia;
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutCompetenciesGroup(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                   "Éxito",
                   "El grupo de competencia se desactivó con éxito.",
                  "success"
                ).then(() => {
                   this.LoadCompetencyGroupsData();
                   this.grupoCompetenciaForm.reset() 
                   this.editingCompetencyGroups = false;
                   Object.keys(this.grupoCompetenciaForm.controls).forEach(key => {
                     this.grupoCompetenciaForm.get(key).setErrors(null);
                   });
                });
              }
            } catch (error) {
              console.error("Error al activar el grupo de competencia:", error);
              Swal.fire(
              "Error",
              "No se pudo actualizar Grupo de Competencias, valide que no tenga Competencias asociadas.",
              "error"
              ).then(() => {
                this.LoadCompetencyGroupsData(); //JA
              });
              
            } 
      }
    })   
  }

  handleCompetencyEdit(competencia: any) {
    this.editingCompetency = true;
    this.competenciaForm.patchValue(competencia);
    this.competenciaForm.get('grupo.codigo').patchValue(competencia.grupo.codigo);
    //console.log(competencia)
    this.competenciaForm.get('codigo').disable();
  }

  async onEditCompetency(): Promise<any>{

    if(this.competenciaForm.get('titulo').value === ''){
      return  Swal.fire('Campo Título Vacío', 'Por favor, complete el campo de titulo antes de continuar.', 'warning')
    }

    if(this.competenciaForm.get('descripcion').value === ''){
      return  Swal.fire('Campo Descripción Vacío', 'Por favor, complete el campo de descripcion antes de continuar.', 'warning')
    }
    

      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas editar la competencia?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Editar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.value) {
            try {
              this.utilsService.showLoading();
              let BodyToSend: IRegisterCompetency = this.competenciaForm.getRawValue();
              let admin = {codigoFicha: this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutCompetencies(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                  "Éxito",
                  "La competencia se editó correctamente.",
                  "success"
                ).then(() => {
                  this.LoadCompetencyData();
                  this.competenciaForm.markAsTouched();
                  this.competenciaForm.get('codigo').enable();
                  this.editingCompetency = false;
                  this.competenciaForm.reset();
                });
              }
            } catch (error) {
              console.error("Error al editar la competencia:", error);
          
              // Mostrar mensaje de error
              Swal.fire(
                "Error",
                "Ocurrió un error al editar la competencia. Valide que no se haya usado en conocimiento o evaluación.",
                "error"
              ).then(() => {
                 this.LoadCompetencyData(); //JA
              });
            }
        }
      })
  }

  async onDeleteCompetency(competencia: any): Promise<void>{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar la competencia?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
            try {
              this.utilsService.showLoading();
              competencia.estado = 0
              let BodyToSend = competencia;
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutCompetencies(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                  "Éxito",
                  "La competencia se desactivó con éxito.",
                  "success"
                ).then(() => {
                  this.LoadCompetencyData();
                  this.competenciaForm.reset();
                  this.editingCompetency = false;
                  Object.keys(this.competenciaForm.controls).forEach(key => {
                    this.competenciaForm.get(key).setErrors(null);
                  });
                });
              }
            } catch (error) {
              console.error("Error al desactivar la competencia:", error);
              Swal.fire(
                "Error",
                "No se pudo actualizar Competencia, valide que no tenga Comportamientos asociados.",
                "error"
              ).then(() => {
                this.LoadCompetencyData(); //JA
              });
            }
      }
    })   
  }

  async onFileSelectedCompetency(event: Event): Promise<any> {
    const input = event.target as HTMLInputElement;
    //console.log(input.files)
    //console.log(input.files.length > 0)
    if (input.files && input.files.length > 0) {
      this.utilsService.showLoading();
      const file = input.files[0];
      //console.log('Nombre del archivo:', file.name);
      //console.log('Tamaño del archivo (bytes):', file.size);
      //console.log('Tipo de archivo:', file.type);
  
      const allowedExtensions = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!allowedExtensions.includes(file.type)) {
        this.utilsService.closeLoading();
        return Swal.fire(
          'Formato no válido',
          'Solo se permiten archivos de Excel (.xlsx, .xls)',
          'error'
        );
      }
  
      if (file.size > 50000000) {
        this.utilsService.closeLoading();
        return Swal.fire(
          'Límite de tamaño superado',
          'El archivo adjunto no puede pesar más de 50MB',
          'info'
        );
      }
  
      try {
        const validation = await this.behaviorsCatalogService
          .PostSendCompetenciesExcelForValidation(file)
          .toPromise();
        this.competenciasExcel = validation;
        //console.log(this.competenciasExcel);
      } finally {
        this.utilsService.closeLoading();
        input.value = ''; 
      }
    }
  }
  
  private async SendCompetenciesData(): Promise<void> {
    this.utilsService.showLoading();
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas cargar las competencias?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Cargar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          this.behaviorsCatalogService.PostSendCompetenciesExcelForSave(this.competenciasExcel.datos.listadoCorrectos,this.AdminData.ficha).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `Los registros se han cargado con éxito`,
                text: `Los registros de competencias se cargaron correctamente.`,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then(() => {
                this.competenciasExcel = null;
                this.dialog.closeAll();
                this.LoadCompetencyData();
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

  handleLevelEdit(nivel: any) {
    this.editingLevel = true;
    this.nivelForm.patchValue(nivel);
    //console.log(nivel)
    this.nivelForm.get('codigo').disable();
  }

  async onEditLevel(): Promise<any>{

    if(this.nivelForm.get('codigo').value === ''){
      return  Swal.fire('Campo Código Vacío', 'Por favor, complete el campo de código antes de continuar.', 'warning')
    }

    if(this.nivelForm.get('nombre').value === ''){
      return  Swal.fire('Campo Nombre Vacío', 'Por favor, complete el campo de nombre antes de continuar.', 'warning')
    }
  
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas editar el nivel?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Editar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.value) {
            try {
              this.utilsService.showLoading();
              let BodyToSend:IRegisterLevels = this.nivelForm.getRawValue();
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutLevels(BodyToSend).toPromise(); 
              if (response) {
                Swal.fire(
                  "Éxito",
                  "El nivel se editado correctamente.",
                  "success"
                ).then(() => {
                  this.LoadLevelsData();
                  this.nivelForm.get('codigo').enable();
                  this.editingLevel = false;
                  this.resetForm();
                });
              }
            } catch (error) {
              console.error("Error al editar el nivel:", error);
              Swal.fire(
                "Error",
                "Ocurrió un error al editar el nivel. Por favor, inténtalo de nuevo.",
                "error"
              );
            } 
        }
      })
  }

  async onDeleteLevel(nivel: any): Promise<void>{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el nivel?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
            try {
              this.utilsService.showLoading();
              nivel.estado = 0
              //console.log(nivel);
              let BodyToSend: IRegisterLevels = nivel;
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutLevels(BodyToSend).toPromise();
          
              if (response) {
                Swal.fire(
                  "Éxito",
                  "El nivel se eliminó correctamente.",
                  "success"
                ).then(() => {
                  this.LoadLevelsData();
                  this.nivelForm.reset();
                  this.editingLevel = false;
                  Object.keys(this.nivelForm.controls).forEach(key => {
                    this.nivelForm.get(key).setErrors(null);
                  });
                });
              }
            } catch (error) {
              console.error("Error al eliminar el nivel:", error); 
              Swal.fire(
                "Error",
                "No se pudo actualizar Nivel, valide que no tenga Grupos de evaluación asignado.",
                "error"
              ).then(()=>{
                this.LoadLevelsData(); //JA
              });
            }
      }
    })   
  }
  
  handleBehaviorEdit(comportamiento: any) {
    this.editingBehaviors = true;
    this.comportamientoForm.patchValue(comportamiento);
    //console.log(comportamiento)
    this.comportamientoForm.get('codigo').disable();
  }

  async onEditBehavior(): Promise<any>{

    if(this.comportamientoForm.get('codigo').value === ''){
      return  Swal.fire('Campo Código Vacío', 'Por favor, complete el campo de código antes de continuar.', 'warning')
    }

    if(this.comportamientoForm.get('descripcion').value === ''){
      return  Swal.fire('Campo Descripción Vacío', 'Por favor, complete el campo de descripción antes de continuar.', 'warning')
    }
 
    if(this.comportamientoForm.get('competencia.codigo').value === ''){
      return  Swal.fire('Campo Competencia Vacío', 'Por favor, complete el campo de competencía antes de continuar.', 'warning')
    }

    if(this.comportamientoForm.get('nivel.codigo').value === ''){
      return  Swal.fire('Campo Nivel Vacío', 'Por favor, complete el campo de nivel antes de continuar.', 'warning')
    }
        
      Swal.fire({
        title:  "Aviso",
        text: `¿Estás seguro de que deseas editar el comportamiento?`,
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: "Editar",
        cancelButtonText: "Cancelar"
      }).then(async (result) => {
        if (result.value) {
            try {
              this.utilsService.showLoading();
              let BodyToSend:IRegisterBehaviors = this.comportamientoForm.getRawValue();
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutBehaviorsReport(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                  "Éxito",
                  "El comportamiento se guardó correctamente.",
                  "success"
                ).then(() => {
                  this.LoadBehaviorsData();
                  this.comportamientoForm.get('codigo').enable();
                  this.editingBehaviors = false;
                  this.comportamientoForm.reset();
                  Object.keys(this.comportamientoForm.controls).forEach(key => {
                    this.comportamientoForm.get(key).setErrors(null);
                  });
                });
              }
            } catch (error) {
              console.error("Error al guardar el comportamiento:", error);
              Swal.fire(
                "Error",
                "Ocurrió un error al editar comportamiento. Valide que no se haya usado en conocimiento o evaluación.",
                "error"
              ).then(()=>{
                this.LoadBehaviorsData();                  
              });
            }
        }
      })
  }

  async onDeleteBehaviors(comportamiento: any): Promise<void>{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el comportamiento?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
            try {
              this.utilsService.showLoading();
              comportamiento.estado = 0
              //console.log(comportamiento);
              let BodyToSend: IRegisterBehaviors = comportamiento;
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutBehaviorsReport(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                  "Éxito",
                  "El comportamiento se eliminó correctamente.",
                  "success"
                ).then(() => {
                  this.LoadBehaviorsData();
                  this.editingBehaviors = false;
                  this.comportamientoForm.reset();
                  Object.keys(this.comportamientoForm.controls).forEach(key => {
                    this.comportamientoForm.get(key).setErrors(null);
                  });
                });
              }
            } catch (error) {
              console.error("Error al eliminar el comportamiento:", error);
              Swal.fire(
                "Error",
                "Ocurrió un error al eliminar el comportamiento. Por favor, inténtalo de nuevo.",
                "error"
              );
            }
      }
    })   
  }

  handleActivateCompetencyGroups(grupoCompetencia: any): any{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar el grupo de competencia?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
            try {
              this.utilsService.showLoading();
              grupoCompetencia.estado = 1
              let BodyToSend: any = grupoCompetencia;
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutCompetenciesGroup(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                   "Éxito",
                   "El grupo de competencia se activó con éxito.",
                  "success"
                ).then(() => {
                   this.LoadCompetencyGroupsData();
                });
              }
            } catch (error) {
              console.error("Error al activar el grupo de competencia:", error);
              Swal.fire(
              "Error",
              "Ocurrió un error al activar el grupo de competencia. Por favor, inténtalo de nuevo.",
              "error"
              );
            }
        }
    })   
  }

  handleActivateCompetency(competencia: any):  any{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar la competencia?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
            try {
              this.utilsService.showLoading();
              competencia.estado = 1
              let BodyToSend = competencia;
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutCompetencies(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                   "Éxito",
                   "La competencia se activó con éxito.",
                  "success"
                ).then(() => {
                  this.LoadCompetencyData();
                  this.competenciaForm.reset() 
                  this.editingCompetency = false;
                  Object.keys(this.competenciaForm.controls).forEach(key => {
                    this.competenciaForm.get(key).setErrors(null);
                  });
                });
              }
            } catch (error) {
              console.error("Error al activar la competencia:", error);
              Swal.fire(
              "Error",
              "Ocurrió un error al activar la competencia. Por favor, inténtalo de nuevo.",
              "error"
              );
        }
      }
    })   
  }

  handleActivateLevels(nivel: any): any{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar el nivel?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
            try {
              this.utilsService.showLoading();
              nivel.estado = 1
              let BodyToSend = nivel;
              let admin = {codigoFicha:this.AdminData.ficha};
              BodyToSend.admin = admin;
              const response = await this.behaviorsCatalogService.PutLevels(BodyToSend).toPromise();
              if (response) {
                Swal.fire(
                   "Éxito",
                   "El nivel se activó con éxito.",
                  "success"
                ).then(() => {
                   this.LoadLevelsData();
                   this.nivelForm.reset() 
                  this.editingLevel = false;
                  Object.keys(this.nivelForm.controls).forEach(key => {
                    this.nivelForm.get(key).setErrors(null);
                  });
                });
              }
            } catch (error) {
              console.error("Error al activar el nivel:", error);
              Swal.fire(
              "Error",
              "Ocurrió un error al activar el nivel. Por favor, inténtalo de nuevo.",
              "error"
              );
            }
      }
    })   
  }

  handleActivateBehaviors(comportamiento: any): any{
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar el comportamiento?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          try {
            this.utilsService.showLoading();
            comportamiento.estado = 1
            let BodyToSend = comportamiento;
            let admin = {codigoFicha:this.AdminData.ficha};
            BodyToSend.admin = admin;
            const response = await this.behaviorsCatalogService.PutBehaviorsReport(comportamiento).toPromise();
            if (response) {
              Swal.fire(
                 "Éxito",
                 "El comportamientos se activó con éxito.",
                "success"
              ).then(() => {
                 this.LoadBehaviorsData();
                 this.editingBehaviors = false;
                 this.comportamientoForm.reset() 
                 Object.keys(this.comportamientoForm.controls).forEach(key => {
                   this.comportamientoForm.get(key).setErrors(null);
                 });
              });
            }
          } catch (error) {
            console.error("Error al activar el comportamiento:", error);
            Swal.fire(
            "Error",
            "Ocurrió un error al activar el comportamiento. Por favor, inténtalo de nuevo.",
            "error"
            );
          }
      }
    })   
  }

  async onFileSelectedBehaviors(event: Event): Promise<any> {
    debugger
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.utilsService.showLoading();
      const file = input.files[0];
      //console.log('Nombre del archivo:', file.name);
      //console.log('Tamaño del archivo (bytes):', file.size);
      //console.log('Tipo de archivo:', file.type);
  
      const allowedExtensions = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
      ];
      if (!allowedExtensions.includes(file.type)) {
        this.utilsService.closeLoading();
        return Swal.fire(
          'Formato no válido',
          'Solo se permiten archivos de Excel (.xlsx, .xls)',
          'error'
        );
      }
  
      if (file.size > 50000000) {
        this.utilsService.closeLoading();
        return Swal.fire(
          'Límite de tamaño superado',
          'El archivo adjunto no puede pesar más de 50MB',
          'info'
        );
      }
  
      try {
        this.comportamientoExcel=null;
        const validation = await this.behaviorsCatalogService
          .PostSendBehaviorsExcelForValidation(file)
          .toPromise();
        this.comportamientoExcel = validation;
        //console.log(this.comportamientoExcel);
      } finally {
        this.utilsService.closeLoading();
        input.value = '';
      }
    }
  }
  
  private async SendBehaviorsData(): Promise<void> {
    this.utilsService.showLoading();
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas cargar los comportamientos?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Cargar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          this.behaviorsCatalogService.PostSendBehaviorsExcelForSave(this.comportamientoExcel.datos.listadoCorrectos,this.AdminData.ficha).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `Los registros se han cargado con éxito`,
                text: `Los registros de comportamientos se cargaron correctamente.`,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then(() => {
                this.comportamientoExcel = null;
                this.dialog.closeAll();
                this.LoadBehaviorsData();
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
