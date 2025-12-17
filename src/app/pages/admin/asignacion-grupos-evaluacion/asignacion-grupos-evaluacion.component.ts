import { IAsignationEvaluationValidateMasive } from './../../../interfaces/IAsignationEvaluationValidateMasive';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild, isDevMode } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { AsignationevalgroupsService } from 'src/app/services/asignationevalgroups/asignationevalgroups.service';
import Swal from 'sweetalert2';
import { EvalgroupsCRUDService } from 'src/app/services/evalgroupsCRUD/evalgroups-crud.service';
import { ParametrizationService } from 'src/app/services/parametrization/parametrization.service';
import { AsignationEvalGroupsErrors } from 'src/app/core/masiveexcelerrorsconst/AsignationEvalGroupsErrors';
import { LoginService } from 'src/app/services/auth/login.service';
import { IAsignationEvaluationGroupsReport } from 'src/app/interfaces/IAsignationEvaluationGroupsReport';
import { IEvaluationGroup } from 'src/app/interfaces/IEvaluationGroup';
import { IRegisterAsignationEvaluationGroups } from 'src/app/interfaces/IRegisterAsignationEvaluationGroups';
import { IUnidadOrganizativa } from 'src/app/interfaces/IUnidadOrganizativa';
import { AdminService } from 'src/app/services/admin/admin.service';
import { IMembers } from 'src/app/interfaces/IMembers';
import { MembersResponse } from 'src/app/interfaces/MembersResponse';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EvalgroupsService } from   'src/app/services/evalgroups/evalgroups.service'; 
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-asignacion-grupos-evaluacion',
  templateUrl: './asignacion-grupos-evaluacion.component.html',
  styleUrls: ['./asignacion-grupos-evaluacion.component.css']
})
export class AsignacionGruposEvaluacionComponent implements OnInit, AfterViewInit {
  editingAsignacion : boolean = false;
  @ViewChild('UploadExcelAssignmentDialog') UploadExcelAssignmentDialog: TemplateRef<any>;
  @ViewChild('paginatorEvalGrupos') paginatorEvalGrupos: MatPaginator;
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  form: FormGroup;
  CalendarData: any = [];
  editingItem: IAsignationEvaluationGroupsReport | any = null;
  gruposEvaluacionSelect: IEvaluationGroup[] = [];
  unidadOrganizativaSelect : IUnidadOrganizativa[] = [];  //PROY-00013 RFC
  CalendarObject :any;
  trabajadorSelect:IMembers[]=[]; //PROY-00013 RFC
  editingEvalGroups: boolean = false;
  AsignationEvalGroupsErrors = AsignationEvalGroupsErrors
  AdminData = this.loginService.GetUserSession();
  gruposevaluacion: IAsignationEvaluationGroupsReport[] = [];
  gruposevaluacionEXCEL:IAsignationEvaluationValidateMasive = null;

  filteredUnidadOrganizativa: ReplaySubject<IUnidadOrganizativa[]> = new ReplaySubject<IUnidadOrganizativa[]>(1);
  uoFilterCtrl: FormControl = new FormControl();

  lastPositionValue: string | null = null;
  dataSourceEvalGroups = new MatTableDataSource<any>(this.gruposevaluacion);
  displayedColumns: string[] = ['grupoevaluacionCod','grupoevaluacionNom','ficha','nombresyapellidos','puesto','posicion','unidadOrganica','ultimamodific','adminmodific','estado','acciones'];
  displayedColumnsExcelModal: string[] = ['codcalendario','grupoevaluacion','codigoficha','nombresapellidos','codpuesto','denominaciónpuesto','observacion'];
  @ViewChild('tablaAsignacion', { read: MatSort }) sortAsignacion!: MatSort;

  private _onDestroy = new Subject<void>();

  constructor(
    public fb: FormBuilder, 
    public dialog: MatDialog, 
    private route: ActivatedRoute, 
    private utilsService: UtilsService, 
    private AEGService: AsignationevalgroupsService, 
    private AsignationEvalGroupsService: EvalgroupsCRUDService,
    private parametrizationService: ParametrizationService,
    private adminService:AdminService, //PROY-00013-RFC
    private loginService: LoginService) {}

  ngAfterViewInit(): void {
    this.dataSourceEvalGroups.paginator = this.paginatorEvalGrupos;
  }

  async ngOnInit(): Promise<any> {
    this.initForm();
    await this.LoadCalendarData();
    await this.LoadAsignationGroupsData();
    await this.LoadEvalGroupsData();
    await this.loadUnidadOrganizativa(); //PROY-00013 RFC

    // inicializa la lista filtrada con todos los datos cargados
    this.filteredUnidadOrganizativa.next(this.unidadOrganizativaSelect.slice());

    // escucha cambios en el buscador
    this.uoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterUo());
    

       if (this.sortAsignacion) {
            this.dataSourceEvalGroups.sort = this.sortAsignacion;
            this.configureSortingDataAccessor();
        }
  }

  /*INI PROY-00013 RFC*/
   async loadUnidadOrganizativa(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalUO = await this.AsignationEvalGroupsService.GetUnidadOrganizativa().toPromise();
      const filteredUOGroup = evalUO.registros.sort((a: any, b: any) => b.codigo - a.codigo);
      this.unidadOrganizativaSelect = filteredUOGroup;
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de las unidades organizativas','Por favor, inténtalo de nuevo más tarde.',"error");
    }
  }

  async loadMemberByTeam(codigoEquipo:string): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalUO = await this.adminService.getMembersByTeam(codigoEquipo).toPromise();
      const filteredMemberGroup = evalUO.registros[0].miembros.sort((a: any, b: any) => b.ficha - a.ficha);
      this.trabajadorSelect = evalUO.registros[0].miembros;
      this.trabajadorSelect.reverse();
      console.log('Datos cargados en trabajadorSelect:', this.trabajadorSelect);
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de trabajadores','Por favor, inténtalo de nuevo más tarde.',"error");
    }
  }

  onTrabajadorSeleccionado(trabajador: MembersResponse) {
    if (trabajador) {
      console.log('Trabajador seleccionado:', trabajador);
      this.form.patchValue({
        ficha: trabajador.ficha,
        posicionTrabajo: trabajador.codCargo,
        Ficha:trabajador.ficha,
        NombApell: `${trabajador.nombre} ${trabajador.apellidos}`,
        Correo: trabajador.correo,
        Puesto: trabajador.desCargo
      });
    }
  }

  
  private filterUo() {
    let search = this.uoFilterCtrl.value;
    if (!search) {
      this.filteredUnidadOrganizativa.next(this.unidadOrganizativaSelect.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredUnidadOrganizativa.next(
      this.unidadOrganizativaSelect.filter((uo: any) =>
        String(uo.nombre).toLowerCase().includes(search)
      )
    );

  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /*FIN PROY-00013 RFC*/

  async LoadAsignationGroupsData(): Promise<any> {
    try{
      this.utilsService.showLoading();
      const asignationEvalygroups = await this.AEGService.GetAsignationEvalsGroupsReport(this.CalendarID).toPromise();
      const filteredAsignationEvalgroups = asignationEvalygroups.registros.sort((a: any, b: any) => b.estado - a.estado); 
      this.gruposevaluacion = filteredAsignationEvalgroups
      this.dataSourceEvalGroups.data = this.gruposevaluacion;
       this.dataSourceEvalGroups.filterPredicate = (data: any, filter: string) => {

        const dataStr = (
                (data.grupoEvaluacion.codigo || '') +          // 1. Código (ID)
                (data.grupoEvaluacion.descripcion || '') +          // 2. Título
                (data.trabajador.codigoPuesto || '')  +    // 3. Descripción
                (data.trabajador.nombrePuesto || '')  +    // 3. Descripción
                (data.trabajador.codigoFicha || '')   +   // 3. Descripción
                (data.trabajador.apellidosNombres  || '')      // 3. Descripción
                
                
               
            ).toLowerCase(); // Todo a minúsculas
            return dataStr.indexOf(filter) !== -1;
        };

      //console.log(this.gruposevaluacion)
      this.utilsService.closeLoading();
    }catch (error){
      return Swal.fire('Error al cargar los datos de cgrupos de competencia','Por favor, inténtalo de nuevo más tarde.',"error");
    }
  }

    applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceEvalGroups.filter = filterValue.trim().toLowerCase(); 
  if (this.dataSourceEvalGroups.paginator) {
    this.dataSourceEvalGroups.paginator.firstPage();
  }
}

configureSortingDataAccessor() {
     this.dataSourceEvalGroups.sortingDataAccessor = (item: any, property: string) => {
         switch (property) {
             // Reescrito de forma limpia y concisa
             case 'grupoevaluacionCod': return item.grupoEvaluacion.codigo;
             case 'grupoevaluacionNom': return item.grupoEvaluacion.descripcion;
             case 'posicion': return item.trabajador.nombrePuesto;
             case 'nombresyapellidos': return item.trabajador.apellidosNombres;
             
                 
             default:
                 const value = item[property];
                 return (typeof value === 'string') ? value.toLowerCase() : value;
         }
     };
}
  async LoadEvalGroupsData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalgroup = await this.AsignationEvalGroupsService.GetEvalGroupsReportCRUD().toPromise();
      const filteredEvalGroup = evalgroup.registros.sort((a: any, b: any) => b.estado - a.estado);
      const filteredEvalGroup2 = evalgroup.registros.filter((data: { estado: number; }) => data.estado === 1);
      this.gruposEvaluacionSelect = filteredEvalGroup2;
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de grupo de evaluación','Por favor, inténtalo de nuevo más tarde.',"error");
    }
  }
 
  async LoadCalendarData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const calendarDataFromApi = await this.parametrizationService.GetParametrizationProgress(this.CalendarID).toPromise();
      this.CalendarData = calendarDataFromApi.registros;
      this.CalendarObject=calendarDataFromApi.registros.calendario; //PROY-00013 RFC
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los datos del calendario:', error);
      return Swal.fire('Error al cargar los datos del calendario', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

    async cancelEditAsignacion(): Promise<any>{
      this.editingAsignacion= false;
       this.form.reset();
        this.editingItem = null;
    
    
  }


  initForm() {
    this.form = this.fb.group({
      idGrupoEvaluacion: ['', Validators.required],
      posicionTrabajo: [{ value: '', disabled: true }, Validators.required],
      codigo:[{value:''}, Validators.required],  //PROY-00013 RFC
      ficha:[{value:''}, Validators.required],  //PROY-00013 RFC
      Ficha:[{value:'', disabled: true }, Validators.required],  //PROY-00013 RFC
      NombApell: [{ value: '', disabled: true }],
      Correo: [{ value: '', disabled: true }],
      Puesto: [{ value: '', disabled: true }],
      idGrupoEvaluacionAsignacion: [{ value: '', disabled: true }],
    });
    
    /* INI PROY-00013 RFC */
   /* this.form.get('idGrupoEvaluacion').valueChanges.subscribe(value => {
      if (value !== '') {
        this.form.get('posicionTrabajo').enable();
      } else {
        this.form.get('posicionTrabajo').disable();
      }
    });*/
    /* FIN PROY-00013 RFC */

    this.form.get('codigo').valueChanges.subscribe((codigo: string) => {
      this.form.get('ficha').reset();
      if (codigo) {
        this.loadMemberByTeam(codigo);
      } else {
        this.trabajadorSelect = [];
      }
    });
  }

  openUploadExcelAssignmentDialog(): void {
    this.gruposevaluacionEXCEL = null;
    this.dialog.open(this.UploadExcelAssignmentDialog, {
      width: '1600px'
    });
  }


  async handleSubmit(): Promise<any> {
    if (this.form.valid) {
      const newAsignacion: any = this.form.getRawValue()

      if (this.editingItem) {
        let BodyToSend: IRegisterAsignationEvaluationGroups = {
          idGrupoEvaluacionAsignacion: newAsignacion.idGrupoEvaluacionAsignacion,
          grupoEvaluacion: {
            codigo: newAsignacion.idGrupoEvaluacion
          },
          calendario: {
            vCodigo: this.CalendarID
          },
          trabajador: {
            codigoPuesto: newAsignacion.posicionTrabajo,
            ficha:newAsignacion.Ficha
          },
          estado: 1,
          admin: {
            codigoFicha: this.AdminData.ficha
          }
        }
        //console.log(BodyToSend)
        if(this.form.get('NombApell').value === '' || 
        this.form.get('NombApell').value === null || 
        this.form.get('Correo').value === '' ||
        this.form.get('Correo').value === null ||
        this.form.get('Puesto').value === '' ||
        this.form.get('Puesto').value === null){
        return  Swal.fire('Campo Código de Puesto Vacío', 'Por favor, complete el campo de código de puesto correctamente antes de continuar.','warning')
      }else{
        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de que deseas editar la asignación de grupo de evaluación?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: "Editar",
          cancelButtonText: "Cancelar"
        }).then(async (result) => {
          if (result.value) {
            this.utilsService.showLoading();
            this.AEGService.PutAsignationEvalsGroups(BodyToSend).subscribe({
              next: (data) => {
                Swal.fire({
                  title:  `La asignación de grupo de evaluación se ha editado con éxito`,
                  text: ``,
                  type: 'success',
                  showCancelButton: false,
                  confirmButtonText: 'OK',
                }).then(() => {
                  this.LoadAsignationGroupsData();
                  this.actualizarDirectorioFicha(BodyToSend.trabajador.ficha);
                  this.form.markAsTouched();;
                  this.form.reset();
                  this.editingItem = null;
                  this.form.get('posicionTrabajo').patchValue('');
                  this.lastPositionValue = '';
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

      } else {
        if(newAsignacion.idGrupoEvaluacion !== null || newAsignacion.posicionTrabajo !== null || newAsignacion.idCalendario != null ){

          //console.log(this.form.get('NombApell').value)
          //console.log(this.form.get('Correo').value)
          //console.log(this.form.get('Puesto').value)
          if(this.form.get('NombApell').value === '' || 
            this.form.get('NombApell').value === null || 
            this.form.get('Correo').value === '' ||
            this.form.get('Correo').value === null ||
            this.form.get('Puesto').value === '' ||
            this.form.get('Puesto').value === null){
            return  Swal.fire('Campo Código de Puesto Vacío', 'Por favor, complete el campo de código de puesto correctamente antes de continuar.','warning')
          }

          //console.log(newAsignacion)
          let BodyToSend: IRegisterAsignationEvaluationGroups = {
            grupoEvaluacion: {
              codigo: newAsignacion.idGrupoEvaluacion
            },
            calendario: {
              vCodigo: this.CalendarID
            },
            trabajador: {
              codigoPuesto: newAsignacion.posicionTrabajo,
              ficha:newAsignacion.ficha
            },
            admin: {
              codigoFicha: this.AdminData.ficha
            }
          }
          const yaExisteAsignacion = this.gruposevaluacion
              .filter(item => item.idGrupoEvaluacionAsignacion !== newAsignacion.idGrupoEvaluacionAsignacion)
              .some(item =>
                //item.grupoEvaluacion && item.grupoEvaluacion.codigo &&
                //item.grupoEvaluacion.codigo.toString().toLowerCase() === newAsignacion.idGrupoEvaluacion.toString().toLowerCase() &&
                item.trabajador && item.trabajador.codigoPuesto &&
                item.trabajador.codigoPuesto.toString().toLowerCase() === newAsignacion.posicionTrabajo.toString().toLowerCase()
          );

          if (yaExisteAsignacion) {
            //return Swal.fire('Asignación duplicada', 'Ya existe una asignación con el mismo grupo de evaluación y código de puesto.', 'warning');
            await Swal.fire('Asignación duplicada', 'Ya existe una asignación con el mismo código de puesto.', 'warning');
            return;
          }
      
          Swal.fire({
            title:  "Aviso",
            text: `¿Estás seguro de que deseas añadir la asignación de grupo de evaluación?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: "Añadir",
            cancelButtonText: "Cancelar"
          }).then(async (result) => {
            if (result.value) {
                this.utilsService.showLoading();
                this.AEGService.PostAsignationEvalsGroups(BodyToSend).subscribe({
                  next: (data) => {
                    Swal.fire({
                      title:  `La asignación de grupo de evaluación se ha registrado con éxito`,
                      text: ``,
                      type: 'success',
                      showCancelButton: false,
                      confirmButtonText: 'OK',
                    }).then(() => {
                      this.LoadAsignationGroupsData();  
                      this.actualizarDirectorioFicha(BodyToSend.trabajador.ficha); 
                      this.editingItem = false;
                      this.form.reset() 
                      Object.keys(this.form.controls).forEach(key => {
                        this.form.get(key).setErrors(null);
                      });
                      this.lastPositionValue = '';
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
    this.editingAsignacion=false;
  }


  /*INI PROY-00013 RFC*/
  //this.actualizarDirectorioFicha(BodyToSend.trabajador.ficha);
  actualizarDirectorioFicha(ficha:string){
    console.log('actualizarDirectorioFicha - Ficha', ficha);
    this.AEGService.UpdateDirectorioFicha(ficha).subscribe({
              next: (data) => {
               console.log('Directorio actualizado para la ficha', ficha);
              },
              error: (error) => {
                 console.error("Error:", error.message);
              }
            });
  }
  /*FIN PROY-00013 RFC*/

  handleEdit(asignacion: any) {
    this.editingAsignacion=true;
    this.editingItem = asignacion;
    //console.log(asignacion)
    this.form.patchValue(asignacion);
    this.form.get('idGrupoEvaluacion').patchValue(asignacion.grupoEvaluacion.codigo)
    this.form.get('posicionTrabajo').patchValue(asignacion.trabajador.codigoPuesto)
    this.form.get('idGrupoEvaluacionAsignacion').patchValue(asignacion.idGrupoEvaluacionAsignacion)
    this.onSearchWorker();
  }

  handleDelete(asignacion: any) {
    let BodyToSend: IRegisterAsignationEvaluationGroups = {
      idGrupoEvaluacionAsignacion: asignacion.idGrupoEvaluacionAsignacion,
      grupoEvaluacion: {
        codigo: asignacion.grupoEvaluacion.codigo
      },
      calendario: {
        vCodigo: this.CalendarID
      },
      trabajador: {
        codigoPuesto: asignacion.trabajador.codigoPuesto,
        ficha:asignacion.trabajador.ficha
      },
      estado: 0,
      admin: {
        codigoFicha: this.AdminData.ficha
      }
    }
    //console.log(BodyToSend)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas eliminar la asignación de grupo de evaluación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.AEGService.PutAsignationEvalsGroups(BodyToSend).subscribe({
          next: (data) => {
            Swal.fire({
              title:  `La asignación de grupo de evaluación se eliminó con éxito`,
              text: ``,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              this.LoadAsignationGroupsData();   
              this.editingItem = false;
              this.form.reset() 
              Object.keys(this.form.controls).forEach(key => {
                this.form.get(key).setErrors(null);
              });
              this.lastPositionValue = '';
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

  handleActivate(asignacion: any) {
    let BodyToSend: IRegisterAsignationEvaluationGroups = {
      idGrupoEvaluacionAsignacion: asignacion.idGrupoEvaluacionAsignacion,
      grupoEvaluacion: {
        codigo: asignacion.grupoEvaluacion.codigo
      },
      calendario: {
        vCodigo: this.CalendarID
      },
      trabajador: {
        codigoPuesto: asignacion.trabajador.codigoPuesto,
        ficha:asignacion.trabajador.ficha
      },
      estado: 1,
      admin: {
        codigoFicha: this.AdminData.ficha
      }
    }
    //console.log(BodyToSend)
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas activar la asignación de grupo de evaluación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Activar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.AEGService.PutAsignationEvalsGroups(BodyToSend).subscribe({
          next: (data) => {
            Swal.fire({
              title:  `La asignación de grupo de evaluación se activó con éxito`,
              text: ``,
              type: 'success',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
              this.LoadAsignationGroupsData();   
            })
          },
          error: (error) => {
            Swal.fire({
              title:  "Ocurrió un error :(",
              text: 'No se pudo activar valide que no tenga asignacion vigente',
              type: 'error',
              showCancelButton: false,
              confirmButtonText: 'OK',
            }).then(() => {
                 this.LoadAsignationGroupsData();   
              }
            );
          }
        });
      }
    })
  }

  async onSearchWorker(): Promise<void> {
    const currentValue = this.form.get('posicionTrabajo').value; 

    if ((currentValue !== this.lastPositionValue) && this.form.get('posicionTrabajo').value !== '') {
      this.lastPositionValue = currentValue;
      try {
        this.utilsService.showLoading();
        const data = await this.AEGService.GetWorkerDataFromPositionCode(currentValue).toPromise();
        if (data.registros && Object.keys(data.registros).length !== 0) {
          //PROY-00013 RFC
          this.form.get('Ficha').patchValue(data.registros.codigoFicha);  
          this.form.get('codigo').patchValue(data.registros.codUnidadOrganica);  
          //this.form.get('ficha').patchValue(data.registros.codigoFicha);  
          await this.loadMemberByTeam(data.registros.codUnidadOrganica);
          //this.form.get('ficha').patchValue(data.registros.codigoFicha);
          let trabajadorEncontrado: MembersResponse | null = null;
          const trabajadores: MembersResponse[] = this.trabajadorSelect as any;
          for (const miembro of trabajadores) {
            if (miembro.ficha && miembro.ficha.trim() === data.registros.codigoFicha.trim()) {
              trabajadorEncontrado = miembro;
              break;
            }
          }

          if(trabajadorEncontrado){
            this.form.get('ficha').patchValue(trabajadorEncontrado);
          }
          //PROY-00013 RFC
          this.form.get('NombApell').patchValue(data.registros.apellidosNombres);
          this.form.get('Correo').patchValue(data.registros.correo);
          this.form.get('Puesto').patchValue(data.registros.nombrePuesto);
          this.utilsService.closeLoading();
        }else{
          Swal.fire('Puesto no encontrado', 'No se encontró información para el puesto ingresado.', 'warning');
          //PROY-00013 RFC
          this.form.get('Ficha').patchValue('');  
          this.form.get('codigo').patchValue(''); 
          this.form.get('ficha').patchValue('');
          //PROY-00013 RFC
          this.form.get('NombApell').patchValue('');
          this.form.get('Correo').patchValue('');
          this.form.get('Puesto').patchValue('');
        }
      } catch (error) {
        return console.error("Error al obtener la información del trabajador:", error);
      }
    }
  }

  async onFileSelectedCompetency(event: Event): Promise<any> {
    const input = event.target as HTMLInputElement;
    const codigoCalendario=this.CalendarData.calendario.vCodigo;
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
        this.gruposevaluacionEXCEL=null;
        const validation = await this.AEGService
          .PostSendAsignationEvalsGroupsExcelForValidation(file,codigoCalendario)
          .toPromise();
        this.gruposevaluacionEXCEL = validation;
        //console.log(this.gruposevaluacionEXCEL);
      } finally {
        this.utilsService.closeLoading();
        input.value = ''; 
      }
    }
  }

  private async SendEvalGroupsAsignationData(): Promise<void> {
    Swal.fire({
      title:  "Aviso",
      text: `¿Estás seguro de que deseas cargar las asignaciones de grupos de evaluación?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Cargar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
          this.utilsService.showLoading();
          this.AEGService.PostSendAsignationEvalsGroupsExcelForSave(this.gruposevaluacionEXCEL.datos.listadoCorrectos,this.AdminData.ficha).subscribe({
            next: (data) => {
              Swal.fire({
                title:  `Los registros se han cargado con éxito`,
                text: `Las asignaciones de grupos de evaluación se cargaron correctamente.`,
                type: 'success',
                showCancelButton: false,
                confirmButtonText: 'OK',
              }).then(() => {
                this.gruposevaluacionEXCEL = null;
                this.dialog.closeAll();
                this.LoadAsignationGroupsData();
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
