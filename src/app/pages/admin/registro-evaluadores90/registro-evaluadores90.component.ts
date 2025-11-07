import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EvalasignationService } from 'src/app/services/evalasignation/evalasignation.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import Swal from 'sweetalert2';
import { ParametrizationService } from 'src/app/services/parametrization/parametrization.service';
import { RegisterEvaluatorAndEvaluatedErrors } from 'src/app/core/masiveexcelerrorsconst/RegisterEvaluatorAndEvaluatedErrors';
import { AdminService } from 'src/app/services/admin/admin.service';
import { LoginService } from 'src/app/services/auth/login.service';
import { IEvaluatorandEvaluatedsReport } from 'src/app/interfaces/IEvaluatorandEvaluatedsReport';
import { IRegisterEvaluatorsAndEvaluated } from 'src/app/interfaces/IRegisterEvaluatorsAndEvaluated';
import { IRegisterEvaluatorsAndEvaluatedValidateMasive } from 'src/app/interfaces/IRegisterEvaluatorsAndEvaluatedValidateMasive';

@Component({
  selector: 'app-registro-evaluadores90',
  templateUrl: './registro-evaluadores90.component.html',
  styleUrls: ['./registro-evaluadores90.component.css']
})
export class RegistroEvaluadores90Component implements OnInit {
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  form: FormGroup;
  lastEvaluatorPositionValue: string | null = null;
  lastEvaluatedPositionValue: string | null = null;
  RegisterEvaluatorAndEvaluatedErrors = RegisterEvaluatorAndEvaluatedErrors
  CalendarName: string = "";
  CalendarData: any;
  AdminData: any = this.loginService.GetUserSession();
  evaluadores: IEvaluatorandEvaluatedsReport[] = [];
  dataSourceEvalAsignation = new MatTableDataSource<any>(this.evaluadores);

  EvalAsignacionExcel: IRegisterEvaluatorsAndEvaluatedValidateMasive = null;

  displayedColumns: string[] = [
    'fichaEvaluador',
    'nombreEvaluador',
    'rolEvaluador',
    'denoPuestoEvaluador',

    'fichaEvaluado',
    'nombreEvaluado',
    'rolEvaluado',
    'denoPuestoEvaluado',
    'ultimamodific',
    'adminmodific',
    'estado',
    'acciones'
  ];
  
  displayedColumnsDialog: string[] = [
    'codigoCalendario',

    'fichaEvaluador',
    'nombreEvaluador',
    'rolEvaluador',
    'denoPuestoEvaluador',
   
    'fichaEvaluado',
    'nombreEvaluado',
    'rolEvaluado',
    'denoPuestoEvaluado',

    'observacion'
  ];

  @ViewChild('UploadExcelEvaluators90Dialog') UploadExcelEvaluators90Dialog: TemplateRef<any>;
  @ViewChild('paginatorEvalGroups') paginatorEvalGroups: MatPaginator;
  editingItem: any = null;

  constructor(public fb: FormBuilder, private adminService: AdminService, private loginService: LoginService, public dialog: MatDialog,private route: ActivatedRoute,private utilsService: UtilsService, private evalAsignationService: EvalasignationService,  private parametrizationService: ParametrizationService) {}

  async ngOnInit(): Promise<any> {
    await this.initForm();
    await this.LoadCalendarInfo();
    await this.LoadEvalAsignationData();
  }

  ngAfterViewInit(): void {
    this.dataSourceEvalAsignation.paginator = this.paginatorEvalGroups;
  }


  async LoadEvalAsignationData(): Promise<any> {
    try{
      this.utilsService.showLoading();
      
      const asignationEvalygroups = await this.evalAsignationService.GetEvalAsignationReport(this.CalendarID).toPromise();
      const filteredAsignationEvalgroups = asignationEvalygroups.registros.sort((a: any, b: any) => b.estado - a.estado); 
      this.evaluadores = filteredAsignationEvalgroups
      this.dataSourceEvalAsignation.data = this.evaluadores;
      //console.log(this.evaluadores)
      this.utilsService.closeLoading();
    }catch (error) {
      console.error('Error al cargar los datos de las asignaciones:', error);
      return Swal.fire('Error al cargar los datos de las asignaciones', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

  initForm() {
    this.form = this.fb.group({
      fichaEvaluador: ['', Validators.required],
      nombreEvaluador: [{ value: '', disabled: true }],
      correoEvaluador: [{ value: '', disabled: true }],
      puestoEvaluador: [{ value: '', disabled: true }],
      codPuestoEvaluador: [{ value: '', disabled: true }],
      fichaEvaluado: ['', Validators.required],
      nombreEvaluado: [{ value: '', disabled: true }],
      correoEvaluado: [{ value: '', disabled: true }],
      puestoEvaluado: [{ value: '', disabled: true }],
      codPuestoEvaluado: [{ value: '', disabled: true }],
      idEvaluacionAsignacion: [{ value: '', disabled: true}]
    });
  }

  async LoadCalendarInfo(): Promise<any>{
    try{
      
      this.utilsService.showLoading();
      const data = await this.parametrizationService.GetParametrizationProgress(this.CalendarID).toPromise();
      //console.log(data.registros)
      this.CalendarData=data.registros.calendario;  //PROY-00013 RFC
      this.CalendarName = data.registros.calendario.vNombre;
      this.utilsService.closeLoading();
    }catch (error) {
      console.error('Error al cargar los datos del calendario:', error);
      return Swal.fire('Error al cargar los datos del calendario', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }


  cargaAutomatica(){
    console.log('cargaAutomatica');
  }


  handleSubmit() {
    if (this.form.valid) {
      const newRegister: any = {...this.form.getRawValue()};

      if (this.editingItem) {
        //console.log('editado')
        //console.log(newRegister)
        if(
          this.form.get('nombreEvaluador').value === '' || 
          this.form.get('nombreEvaluador').value === null || 
          this.form.get('correoEvaluador').value === '' ||
          this.form.get('correoEvaluador').value === null ||
          this.form.get('puestoEvaluador').value === '' ||
          this.form.get('puestoEvaluador').value === null)
          {
            return  Swal.fire('Campo Código de Ficha del Evaluador Vacío', 'Por favor, complete el campo de código de ficha del evaluador correctamente antes de continuar.','warning')
          }
  
          if(
            this.form.get('nombreEvaluado').value === '' || 
            this.form.get('nombreEvaluado').value === null || 
            this.form.get('correoEvaluado').value === '' ||
            this.form.get('correoEvaluado').value === null ||
            this.form.get('puestoEvaluado').value === '' ||
            this.form.get('puestoEvaluado').value === null)
            {
              return  Swal.fire('Campo Código de Ficha del Evaluado Vacío', 'Por favor, complete el campo de código de ficha del evaluado correctamente antes de continuar.','warning')
            }
          if (String(this.form.get('fichaEvaluador').value).padStart(8,'0') ===String(this.form.get('fichaEvaluado').value).padStart(8,'0')) {
            return  Swal.fire('Error', 'Evaluador y Evaluado no puede ser el mismo.','warning')
          }
            Swal.fire({
              title:  "Aviso",
              text: `¿Estás seguro de que deseas actualizar el registro del evaluador y evaluado?`,
              type: 'warning',
              showCancelButton: true,
              confirmButtonText: "Añadir",
              cancelButtonText: "Cancelar"
            }).then(async (result) => {
              if (result.value) {
                  this.utilsService.showLoading();
                  let bodyToSend: IRegisterEvaluatorsAndEvaluated = 
                  {
                    idEvaluacionAsignacion: newRegister.idEvaluacionAsignacion,
                    evaluador: {
                      codigoPuesto: newRegister.codPuestoEvaluador,
                      tipoEvaluador: 1
                    },
                    evaluado: {
                      codigoPuesto: newRegister.codPuestoEvaluado
                    },
                    calendario: {
                      vCodigo: this.CalendarID,
                    },
                    estado: 1,
                    admin: {
                      codigoFicha: this.AdminData.ficha
                    }
                  }
                  //console.log(bodyToSend)
                  this.utilsService.showLoading();
                  this.evalAsignationService.PutEvalAsignationReports(bodyToSend).subscribe({
                    next: (data) => {
                      Swal.fire({
                        title:  `El registro se ha actualizado con éxito.`,
                        text: ``,
                        type: 'success',
                        showCancelButton: false,
                        confirmButtonText: 'OK',
                      }).then(() => {
                        this.LoadEvalAsignationData();
                        this.form.markAsTouched();;
                        this.form.reset();
                        this.editingItem = null;
                        this.lastEvaluatorPositionValue = '';
                        this.lastEvaluatedPositionValue = '';
                        Object.keys(this.form.controls).forEach(key => {
                          this.form.get(key).setErrors(null);
                        });     
                      })
                    },
                    error: (error) => {
                      Swal.fire({
                        title:  "Ocurrió un error :(",
                        text: 'No se pudo actualizar que la asignación no exista',
                        type: 'error',
                        showCancelButton: false,
                        confirmButtonText: 'OK',
                      }).then(() => {
                         this.form.markAsTouched();;
                        this.form.reset();
                      });
                    }
                  });           
              }
            })  
      } else {
        if(
        this.form.get('nombreEvaluador').value === '' || 
        this.form.get('nombreEvaluador').value === null || 
        this.form.get('correoEvaluador').value === '' ||
        this.form.get('correoEvaluador').value === null ||
        this.form.get('puestoEvaluador').value === '' ||
        this.form.get('puestoEvaluador').value === null)
        {
          return  Swal.fire('Campo Código de Ficha del Evaluador Vacío', 'Por favor, complete el campo de código de ficha del evaluador correctamente antes de continuar.','warning')
        }

        if(
          this.form.get('nombreEvaluado').value === '' || 
          this.form.get('nombreEvaluado').value === null || 
          this.form.get('correoEvaluado').value === '' ||
          this.form.get('correoEvaluado').value === null ||
          this.form.get('puestoEvaluado').value === '' ||
          this.form.get('puestoEvaluado').value === null)
          {
            return  Swal.fire('Campo Código de Ficha del Evaluado Vacío', 'Por favor, complete el campo de código de ficha del evaluado correctamente antes de continuar.','warning')
          }

          if (this.form.get('fichaEvaluador').value ===this.form.get('fichaEvaluado').value) {
            return  Swal.fire('Error', 'Evaluador y Evaluado no puede ser el mismo.','warning')
          }
    
          Swal.fire({
            title:  "Aviso",
            text: `¿Estás seguro de que deseas añadir el registro del evaluador y evaluado?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Añadir",
            cancelButtonText: "Cancelar"
          }).then(async (result) => {
            if (result.value) {
                this.utilsService.showLoading();
                let bodyToSend: IRegisterEvaluatorsAndEvaluated = 
                {
                  evaluador: {
                    codigoPuesto: newRegister.codPuestoEvaluador,
                    tipoEvaluador: 1
                  },
                  evaluado: {
                    codigoPuesto: newRegister.codPuestoEvaluado
                  },
                  calendario: {
                    vCodigo: this.CalendarID
                  },
                  admin: {
                    codigoFicha: this.AdminData.ficha
                  }
                }

                this.utilsService.showLoading();
                this.evalAsignationService.PostEvalAsignationReport(bodyToSend).subscribe({
                  next: (data) => {
                    Swal.fire({
                      title:  `El registro se ha añadido con éxito.`,
                      text: ``,
                      type: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'OK',
                    }).then(() => {
                      this.LoadEvalAsignationData();
                      this.form.markAsTouched();;
                      this.form.reset();
                      this.lastEvaluatorPositionValue = '';
                      this.lastEvaluatedPositionValue = '';
                      Object.keys(this.form.controls).forEach(key => {
                        this.form.get(key).setErrors(null);
                      });     
                    })
                  },
                  error: (error) => {
                    Swal.fire({
                      title:  "Ocurrió un error :(",
                     text: 'No se puede insertar valide que la asignación no exista',
                      type: 'error',
                      showCancelButton: false,
                      confirmButtonText: 'OK',
                    }).then(() => {
                       this.form.reset();
                    });
                  }
                });           
            }
          })  
      }
    }
  }

  async onSearchEvaluator(): Promise<void> {
    const currentValue = this.form.get('fichaEvaluador').value; 

    if ((currentValue !== this.lastEvaluatorPositionValue) && this.form.get('fichaEvaluador').value !== '') {
      this.lastEvaluatorPositionValue = currentValue;

      try {
        this.utilsService.showLoading();
        const data = await this.adminService.GetWorkerInfoForRegisterAdminModal(currentValue).toPromise();
        //console.log(data)
        if (data.registros && Object.keys(data.registros).length !== 0) {
          this.form.get('nombreEvaluador').patchValue(data.registros.apellidosNombres);
          this.form.get('correoEvaluador').patchValue(data.registros.correo);
          this.form.get('puestoEvaluador').patchValue(data.registros.nombrePuesto);
          this.form.get('codPuestoEvaluador').patchValue(data.registros.codigoPuesto);
          this.utilsService.closeLoading();
        }else{
          Swal.fire('Ficha no encontrada', 'No se encontró información para la ficha ingresada.', 'warning');
          this.form.get('nombreEvaluador').patchValue('');
          this.form.get('correoEvaluador').patchValue('');
          this.form.get('puestoEvaluador').patchValue('');
          this.form.get('codPuestoEvaluador').patchValue('');
        }
      
      

      } catch (error) {
        console.error("Error al obtener la información del trabajador:", error);
      }
    }
  }

  async onSearchEvaluated(): Promise<void> {
    const currentValue = this.form.get('fichaEvaluado').value; 

    if ((currentValue !== this.lastEvaluatedPositionValue) && this.form.get('fichaEvaluado').value !== '') {
      this.lastEvaluatedPositionValue = currentValue;

      try {
        this.utilsService.showLoading();
        const data = await this.adminService.GetWorkerInfoForRegisterAdminModal(currentValue).toPromise();
        if (data.registros && Object.keys(data.registros).length !== 0) {
          if (data.registros.jefe===true){
            this.utilsService.closeLoading();
              Swal.fire('Error ', 'En 90° los evaluados no deben ser jefes.', 'warning');
          } else {
            this.form.get('nombreEvaluado').patchValue(data.registros.apellidosNombres);
            this.form.get('correoEvaluado').patchValue(data.registros.correo);
            this.form.get('puestoEvaluado').patchValue(data.registros.nombrePuesto);
            this.form.get('codPuestoEvaluado').patchValue(data.registros.codigoPuesto);
            this.utilsService.closeLoading();
          }
         
          
        }else{
          Swal.fire('Ficha no encontrada', 'No se encontró información para la ficha ingresada.', 'warning');
          this.form.get('nombreEvaluado').patchValue('');
          this.form.get('correoEvaluado').patchValue('');
          this.form.get('puestoEvaluado').patchValue('');
          this.form.get('codPuestoEvaluado').patchValue('');
        }
      
      

      } catch (error) {
        console.error("Error al obtener la información del trabajador:", error);
      }
    }
  }

  handleEdit(registro: any) {
    this.editingItem = registro;
    //console.log(registro)
    this.form.get('fichaEvaluador').patchValue(registro.evaluador.codigoFicha);
    this.form.get('fichaEvaluado').patchValue(registro.evaluado.codigoFicha);
    this.form.get('idEvaluacionAsignacion').patchValue(registro.idEvaluacionAsignacion)
    this.onSearchEvaluator();
    this.onSearchEvaluated();
  }

  handleDelete(registro: any) {
    //console.log(registro)
    let bodyToSend: IRegisterEvaluatorsAndEvaluated = 
    {
      idEvaluacionAsignacion: registro.idEvaluacionAsignacion,
      evaluador: {
        codigoPuesto: registro.evaluador.codigoPuesto,
        tipoEvaluador: 1
      },
      evaluado: {
        codigoPuesto: registro.evaluado.codigoPuesto
      },
      calendario: {
        vCodigo: this.CalendarID,
      },
      estado: 0,
      admin: {
        codigoFicha: this.AdminData.ficha
      }
    }
    //console.log(bodyToSend)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el registro del evaluador y evaluado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.evalAsignationService.PutEvalAsignationReports(bodyToSend).subscribe({
          next: (data) => {
            Swal.fire({
              title:  `El registro se ha eliminado con éxito.`,
              text: ``,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              this.LoadEvalAsignationData();   
              this.editingItem = null;
              this.form.reset() 
              Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).setErrors(null);
              });
              this.lastEvaluatedPositionValue = '';
              this.lastEvaluatorPositionValue = '';
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

  handleActivate(registro: any) {
    //console.log(registro)
    let bodyToSend: IRegisterEvaluatorsAndEvaluated = 
    {
      idEvaluacionAsignacion: registro.idEvaluacionAsignacion,
      evaluador: {
        codigoPuesto: registro.evaluador.codigoPuesto,
        tipoEvaluador: 1
      },
      evaluado: {
        codigoPuesto: registro.evaluado.codigoPuesto
      },
      calendario: {
        vCodigo: this.CalendarID,
      },
      estado: 1,
      admin: {
        codigoFicha: this.AdminData.ficha
      }
    }
    //console.log(bodyToSend)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar el registro del evaluador y evaluado?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.evalAsignationService.PutEvalAsignationReports(bodyToSend).subscribe({
          next: (data) => {
            Swal.fire({
              title:  `El registro se ha activado con éxito.`,
              text: ``,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              this.LoadEvalAsignationData();    
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

  async onFileSelectedEvaluatorsRegister(event: Event): Promise<any> {
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
        const validation = await this.evalAsignationService
          .PostSendEvalAsignationExcelForValidation(file)
          .toPromise();
        this.EvalAsignacionExcel = validation;
        //console.log(this.EvalAsignacionExcel);
      } finally {
        this.utilsService.closeLoading();
        input.value = ''; 
      }
    }
  }

  private async SendEvalGroupsAsignationData(): Promise<void> {
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas cargar los registros de evaluadores y evaluados?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Cargar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          this.evalAsignationService.PostSendEvalAsignationExcelForSave(this.EvalAsignacionExcel.datos.listadoCorrectos, this.AdminData.ficha).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `Los registros se han cargado con éxito.`,
                text: `Los evaluadores y evaluados se cargaron correctamente.`,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then(() => {
                this.EvalAsignacionExcel = null;
                this.dialog.closeAll();
                this.LoadEvalAsignationData();
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

  
  openUploadExcelEvaluators90Dialog(): void {
    this.dialog.open(this.UploadExcelEvaluators90Dialog, {
      width: '1900px'
    });
  }
  

}