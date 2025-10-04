import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router'; 
import { EvalasignationService } from 'src/app/services/evalasignation/evalasignation.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import Swal from 'sweetalert2';
import { ParametrizationService } from 'src/app/services/parametrization/parametrization.service';
import { CalcrulesService } from 'src/app/services/calcrules/calcrules.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { RegisterEvaluatorAndEvaluatedErrors } from 'src/app/core/masiveexcelerrorsconst/RegisterEvaluatorAndEvaluatedErrors';
import { AdminService } from 'src/app/services/admin/admin.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from 'src/app/services/auth/login.service';
import { IEvaluatorandEvaluatedsReport } from 'src/app/interfaces/IEvaluatorandEvaluatedsReport';
import { IRegisterEvaluatorsAndEvaluatedValidateMasive } from 'src/app/interfaces/IRegisterEvaluatorsAndEvaluatedValidateMasive';

@Component({
  selector: 'app-registro-evaluadores180',
  templateUrl: './registro-evaluadores180.component.html',
  styleUrls: ['./registro-evaluadores180.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class RegistroEvaluadores180Component implements OnInit {
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  form: FormGroup;
  lastEvaluatorPositionValue: string | null = null;
  lastEvaluatedPositionValue: string | null = null;
  RegisterEvaluatorAndEvaluatedErrors = RegisterEvaluatorAndEvaluatedErrors
  CalendarName: string = "";
  evaluadores: IEvaluatorandEvaluatedsReport[] = [];
  findedEvaluator: boolean = false;
  findedEvaluated: boolean = false;
  AdminData: any = this.loginService.GetUserSession();
  evaluatorsArrayForValidation: any[] = [];
  EvalAsignacionExcel: IRegisterEvaluatorsAndEvaluatedValidateMasive = null;
  @ViewChild(MatPaginator) paginator!: MatPaginator; // Vincular el paginador
  dataSource = new MatTableDataSource<any>(); // Convertir dataSource a MatTableDataSource

   evaluations: IEvaluatorandEvaluatedsReport[] = [];
   /*INI PROY-00013*/
   //displayedColumns = ['expand', 'fichaEvaluado', 'nombreEvaluado', 'puestoEvaluado', 'denominacionPuestoEvaluado', 'ultimaModificacion', 'ultimoAdmin', 'estado', 'acciones'];
   displayedColumns = ['expand', 'fichaEvaluado', 'nombreEvaluado', 'nombreCortoUO','puestoEvaluado', 'denominacionPuestoEvaluado', 'ultimaModificacion', 'ultimoAdmin', 'estado', 'acciones'];
   /*FIN PROY-00013*/
  
  displayedColumnsDialog: string[] = [
    'codigoCalendario',
    'fichaEvaluador',
    'nombreEvaluador',
    'rolEvaluador',
    'posicionEvaluador',
    'tipoevaluador',
    'fichaEvaluado',
    'nombreEvaluado',
    'rolEvaluado',
    'posicionEvaluado',
    'observacion'
  ];


  evaluators: any = [
    { fileCode: '', type: 'Evaluado', name:'', email: '', denominacion: '',isEvaluator: false, codEvaluation: '0', posicionCode: '0', isEditing: false },
    { fileCode: '', type: 'Jefe Evaluador', name:'', email: '', denominacion: '',  isEvaluator: true, evaluatortypenumber: 1, idEvaluacionAsignacion: '000000', posicionCode: '0'},
  ];
  isEditing: boolean = true;

  @ViewChild('UploadExcelEvaluators90Dialog') UploadExcelEvaluators90Dialog: TemplateRef<any>;
  editingItem: boolean = false;

  constructor(
    public fb: FormBuilder, 
    private loginService: LoginService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private utilsService: UtilsService, 
    private evalAsignationService: EvalasignationService,
    private parametrizationService: ParametrizationService,
    private calculationRulesService: CalcrulesService,
    private adminService: AdminService,
    private router: Router) {}

  async ngOnInit(): Promise<any> {
    await this.LoadCalendarInfo();
    await this.LoadCalendarCalcRulesInfo();
    await this.LoadEvalAsignationData();
  }

  async LoadCalendarInfo(): Promise<any>{
    try{
      this.utilsService.showLoading();
      const data = await this.parametrizationService.GetParametrizationProgress(this.CalendarID).toPromise();
      //console.log(data.registros)
      this.CalendarName = data.registros.calendario.vNombre;
      this.utilsService.closeLoading();
    }catch (error) {
      console.error('Error al cargar los datos del calendario:', error);
      return Swal.fire('Error al cargar los datos del calendario', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
        this.router.navigateByUrl(`/home/parametrizar-calendario/${this.CalendarID}`);
      })
    }
  }

  async LoadEvalAsignationData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const asignationEvalygroups = await this.evalAsignationService.GetEvalAsignationReport(this.CalendarID).toPromise();
      const filteredAsignationEvalgroups = asignationEvalygroups.registros.sort((a: any, b: any) => b.estado - a.estado); 
      this.evaluadores = filteredAsignationEvalgroups
      this.evaluations = this.evaluadores
      //console.log(this.evaluadores)
      this.processData();
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los datos de asignación del calendario:', error);
      return Swal.fire('Error al cargar los datos de asignación del calendario', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
        this.router.navigateByUrl(`/home/parametrizar-calendario/${this.CalendarID}`);
      })
    } 
  }

  async LoadCalendarCalcRulesInfo(): Promise<any>{
    try {
      this.utilsService.showLoading();
      const data: any = await this.calculationRulesService
        .GetCalendarDataForCalcRules(this.CalendarID)
        .toPromise();
      //console.log(data.registros);
    
      for (let i = 0; i < data.registros.cantidadEvaluadoresSubordinados; i++) {
        this.addSubordinate();
      }
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error fetching calendar data:', error);
      return Swal.fire('Error al cargar los datos de reglas de cálculo del calendario', 'Por favor, inténtalo de nuevo más tarde.', 'error').then(() => {
        this.router.navigateByUrl(`/home/parametrizar-calendario/${this.CalendarID}`);
      })
    }
  }  
  
  toggleRow(element: any) {
    element.expanded = !element.expanded;
  }

  processData() {
    if (!this.evaluations || this.evaluations.length === 0) {
      this.dataSource.data = [];
      return;
    }
  
    // Agrupar por evaluado
    const grouped = this.evaluations.reduce((acc, curr) => {
      const key = curr.evaluado.codigoFicha;
  
      if (!acc[key]) {
        acc[key] = {
          evaluado: curr.evaluado,
          estado: curr.estado,
          ultimaModificacion: curr.fecModificacion, // Inicializa con la primera fecha
          adminModificacion: curr.admin, // Inicializa con el primer administrador
          evaluators: [],
          expanded: false,
        };
      }
  
      // Verificar y actualizar la última fecha de modificación y el administrador correspondiente
      if (new Date(curr.fecModificacion) > new Date(acc[key].ultimaModificacion)) {
        acc[key].ultimaModificacion = curr.fecModificacion;
        acc[key].adminModificacion = curr.admin;
      }
  
      acc[key].evaluators.push(curr);
      return acc;
    }, {} as { [key: string]: any });
  
    // Ordenar evaluadores por tipo de evaluador
      Object.keys(grouped).forEach(key => {
      grouped[key].evaluators.sort((a: any, b: any) => {
        if (a.evaluador.tipoEvaluador < b.evaluador.tipoEvaluador) {
          return -1;
        } else if (a.evaluador.tipoEvaluador > b.evaluador.tipoEvaluador) {
          return 1;
        }
        return 0;
      });
    });
  
    // Asignar al dataSource
    this.dataSource.data = Object.values(grouped);
    this.dataSource.paginator = this.paginator; // Vincular el paginador
  }

  getEvaluatorRole(tipoEvaluador: number): string {
    switch (tipoEvaluador) {
      case 1: return 'Jefe evaluador';
      default: return 'Subordinado ' + (tipoEvaluador - 1);
    }
 
  }

  
  handleSubmit() {
    if (this.evaluators.some((item, index) =>this.evaluators.findIndex(e => e.fileCode === item.fileCode) !== index && item.fileCode !== "")) 
      {
        //console.log('CÓDIGO REPETIDO');
        return Swal.fire(
          'Código de ficha repetida',
          'Por favor, ingrese un código de ficha diferente.',
          'warning'
        );
        
      }

    if(!this.hasEmptyFields()){
      if(!this.editingItem){
        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas añadir el registro del evaluador y evaluado de 180°?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "Añadir",
          cancelButtonText: "Cancelar"
        }).then(async (result) => {
          if (result.value) {
              this.utilsService.showLoading();
              let BodyToSend: any = []
              
              for (let i = 1; i < this.evaluators.length; i++) {
                let BodyToPush = 
                {
                  evaluador:{
                    codigoPuesto: this.evaluators[i].posicionCode,
                    tipoEvaluador: this.evaluators[i].evaluatortypenumber
                  },
                  evaluado:{
                    codigoPuesto: this.evaluators[0].posicionCode
                  },
                  calendario: {
                    vCodigo: this.CalendarID
                  },
                  admin: {
                    codigoFicha: this.AdminData.ficha
                  }
                }
                BodyToSend.push(BodyToPush);
              }
              //console.log(BodyToSend)
              this.utilsService.showLoading();
              this.evalAsignationService.PostEvalAsignation180(BodyToSend).subscribe({
                next: (data) => {
                  Swal.fire({
                    title:  `El registro se ha añadido con éxito`,
                    text: ``,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                  }).then(() => {
                    this.LoadEvalAsignationData();
                    this.evaluators = [
                      { fileCode: '', type: 'Evaluado', name:'', email: '', denominacion: '',isEvaluator: false },
                      { fileCode: '', type: 'Jefe Evaluador', name:'', email: '', denominacion: '',  isEvaluator: true, evaluatortypenumber: 1 },
                    ];
                    this.LoadCalendarCalcRulesInfo();
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

      }else{
        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas editar el registro del evaluador y evaluado de 180°?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "Editar",
          cancelButtonText: "Cancelar"
        }).then(async (result) => {
          if (result.value) {
              this.utilsService.showLoading();
              let BodyToSend: any = []

              for (let i = 1; i < this.evaluators.length; i++) {
                let BodyToPush = 
                {
                  idEvaluacionAsignacion: this.evaluators[i].idEvaluacionAsignacion,
                  evaluador:{
                    codigoPuesto: this.evaluators[i].posicionCode,
                    tipoEvaluador: this.evaluators[i].evaluatortypenumber
                  },
                  evaluado:{
                    codigoPuesto: this.evaluators[0].posicionCode
                  },
                  calendario: {
                    vCodigo: this.CalendarID
                  },
                  estado: 1,
                  admin: {
                    codigoFicha: this.AdminData.ficha
                  }
                }
                BodyToSend.push(BodyToPush);
              }
       
              // const missingValues = this.findMissingValues(this.evaluatorsArrayForValidation, this.evaluators);
      
              // for (let i = 0; i < missingValues.length; i++) {
              //   //console.log(missingValues[i])
              //   const BodyToPush2 = {
              //     idEvaluacionAsignacion: missingValues[i].idEvaluacionAsignacion,
              //     evaluador: {
              //       codigoPuesto: missingValues[i].posicionCode,
              //       tipoEvaluador: missingValues[i].evaluatortypenumber,
              //     },
              //     evaluado: {
              //       codigoPuesto: this.evaluators[0].posicionCode,
              //     },
              //     calendario: {
              //       vCodigo: this.CalendarID,
              //     },
              //     estado: 0,
              //   };
              //   BodyToSend.push(BodyToPush2);
              // }
              //console.log(BodyToSend)

              this.utilsService.showLoading();
              this.evalAsignationService.PutEvalAsignation180(BodyToSend).subscribe({
                next: (data) => {
                  Swal.fire({
                    title:  `El registro se ha editado con éxito`,
                    text: ``,
                    type: 'success',
                    showCancelButton: false,
                    confirmButtonText: 'OK',
                  }).then(() => {
                    this.LoadEvalAsignationData();
                    this.evaluators = [
                      { fileCode: '', type: 'Evaluado', name:'', email: '', denominacion: '',isEvaluator: false },
                      { fileCode: '', type: 'Jefe Evaluador', name:'', email: '', denominacion: '',  isEvaluator: true, evaluatortypenumber: 1 },
                    ];
                    this.evaluators[0].isEditing = true;
                    this.LoadCalendarCalcRulesInfo();
                    this.evaluatorsArrayForValidation = [];
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
    }else{
      return Swal.fire(
        'Campo sin información',
        "Por favor, completa todos los campos para continuar.",
        'warning'
      );
    }
  }

  findMissingValues(evaluatorsArrayForValidation: any[],evaluators: any[]): any[] {
    return evaluatorsArrayForValidation.filter((validationEvaluator) =>!evaluators.some((evaluator) => evaluator.fileCode === validationEvaluator.fileCode));
  }

  toggleEditing() {
    //console.log(this.evaluators)
    this.isEditing = !this.isEditing;
  }

  addSubordinate() {
    this.utilsService.showLoading();
    const newSubordinate: any = {
      fileCode: ``,
      type: `Subordinado ${this.evaluators.length - 1}`,
      name: ``,
      email: ``,
      denominacion: ``,
      isEvaluator: true,
      evaluatortypenumber: this.evaluators.length - 0,
      posicionCode: '0'
    };
    this.evaluators.push(newSubordinate);
  }


  async onSearchWorker(index: string): Promise<any> {
    if(this.evaluators[index].fileCode === ''){
      //console.log('NO SE INGRESÓ VALOR');
      return Swal.fire(
        'No se ingresó un valor',
        'No se ingresó un valor, por favor, ingrese un valor para realizar la busqueda.',
        'warning'
      );
    }

    if (this.evaluators.some((item, index) =>this.evaluators.findIndex(e => e.fileCode === item.fileCode) !== index && item.fileCode !== "")) 
    {
      //console.log('CÓDIGO REPETIDO');
      this.evaluators[index].fileCode = ''
      return Swal.fire(
        'Trabajador se encuentra ya en el listado',
        'El trabajador ya se encuentra en el listado, por favor busque otro',
        'warning'
      );
    }
    
      try {
        this.utilsService.showLoading();
        const data = await this.adminService.GetWorkerInfoForRegisterAdminModal(this.evaluators[index].fileCode).toPromise();
        if (data.registros && Object.keys(data.registros).length !== 0) {
          this.evaluators[index].name = data.registros.apellidosNombres;
          this.evaluators[index].email = data.registros.correo;
          this.evaluators[index].denominacion = data.registros.nombrePuesto;
          this.evaluators[index].posicionCode = data.registros.codigoPuesto
          this.utilsService.closeLoading();
        }else{
          this.findedEvaluator = false;
          this.evaluators[index].name = ''
          this.evaluators[index].email = ''
          this.evaluators[index].denominacion = ''
          this.evaluators[index].posicionCode = ''
          return Swal.fire('Puesto no encontrado', 'No se encontró información para el puesto ingresado.', 'warning');
        }
      } catch (error) {
        console.error("Error al obtener la información del trabajador:", error);
      }
  }

  hasEmptyFields(): boolean {
    return this.evaluators.some(item =>
      Object.values(item).some(value => value === "")
    );
  }

  async handleEdit(registro: any) {
    this.evaluators[0].isEditing = true;
    //console.log(registro)
    this.editingItem = true;
    this.evaluators[0].fileCode = registro.evaluado.codigoFicha;
    await this.onSearchWorker('0');
  
    let i = 1;
    for (const item of registro.evaluators) {
      //console.log(item.evaluador.codigoFicha);
      this.evaluators[i].fileCode = item.evaluador.codigoFicha;
      this.evaluators[i].idEvaluacionAsignacion = item.idEvaluacionAsignacion;
      await this.onSearchWorker(i.toString());
      i++;
    }

    this.evaluatorsArrayForValidation = JSON.parse(JSON.stringify(this.evaluators));
  }
  

  handleDelete(registro: any) {
    //console.log(registro)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar el registro del evaluador y evaluado de 180°?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          let BodyToSend: any = []
   
          for (let i = 0; i < registro.evaluators.length; i++) {
            const BodyToPush = {
              idEvaluacionAsignacion: registro.evaluators[i].idEvaluacionAsignacion,
              evaluador: {
                codigoPuesto: registro.evaluators[i].evaluador.codigoPuesto,
                tipoEvaluador: registro.evaluators[i].evaluador.tipoEvaluador,
              },
              evaluado: {
                codigoPuesto: registro.evaluators[i].evaluado.codigoPuesto,
              },
              calendario: {
                vCodigo: this.CalendarID,
              },
              estado: 0,
              admin: {
                codigoFicha: this.AdminData.ficha
              }
            };
            if(registro.evaluators[i].estado === 1){
              BodyToSend.push(BodyToPush);
            }
          }
          this.utilsService.showLoading();
          this.evalAsignationService.PutEvalAsignation180(BodyToSend).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `El registro se ha eliminado con éxito`,
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
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar el registro del evaluador y evaluado de 180°?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          let BodyToSend: any = []
   
          for (let i = 0; i < registro.evaluators.length; i++) {
            const BodyToPush = {
              idEvaluacionAsignacion: registro.evaluators[i].idEvaluacionAsignacion,
              evaluador: {
                codigoPuesto: registro.evaluators[i].evaluador.codigoPuesto,
                tipoEvaluador: registro.evaluators[i].evaluador.tipoEvaluador,
              },
              evaluado: {
                codigoPuesto: registro.evaluators[i].evaluado.codigoPuesto,
              },
              calendario: {
                vCodigo: this.CalendarID,
              },
              estado: 1,
              admin: {
                codigoFicha: this.AdminData.ficha
              }
            };  
            BodyToSend.push(BodyToPush);
          }
         
          //console.log(BodyToSend)
          this.utilsService.showLoading();
          this.evalAsignationService.PutEvalAsignation180(BodyToSend).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `El registro se ha activado con éxito`,
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
          //console.log(this.EvalAsignacionExcel.datos.listadoCorrectos)
          this.evalAsignationService.PostSendEvalAsignationExcelForSave(this.EvalAsignacionExcel.datos.listadoCorrectos, this.AdminData.ficha).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `Los registros se han cargado con éxito`,
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