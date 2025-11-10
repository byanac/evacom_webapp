import { Component, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { IEvaluationGroupFilter } from 'src/app/interfaces/IEvaluationGroupFilter';
import { ISchedule } from 'src/app/interfaces/ISchedule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CalendarService } from 'src/app/services/calendar/calendar.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { EvalgroupsCRUDService } from 'src/app/services/evalgroupsCRUD/evalgroups-crud.service';
import { IEvaluationGroup } from 'src/app/interfaces/IEvaluationGroup';
import { IUnidadOrganizativa } from 'src/app/interfaces/IUnidadOrganizativa';
import { AdminService } from 'src/app/services/admin/admin.service';
import { IMembers } from 'src/app/interfaces/IMembers';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { AsignationevalgroupsService } from 'src/app/services/asignationevalgroups/asignationevalgroups.service';
import { LoginService } from 'src/app/services/auth/login.service';
import Swal from 'sweetalert2';
import { SelectionModel } from '@angular/cdk/collections';
import { FormControl } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EvalasignationService } from 'src/app/services/evalasignation/evalasignation.service';

@Component({
  selector: 'registro-evaluado-evaluador-carga-automatica',
  templateUrl: './registro-evaluado-evaluador-carga-automatica.component.html',
  styleUrls: ['./registro-evaluado-evaluador-carga-automatica.component.css']
})
export class RegistroEvaluadoEvaluadorCargaAutomaticavalComponent {
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  @ViewChild('paginatorMembers') paginatorEvalGrupos: MatPaginator;
  calendarData!: ISchedule
  form: FormGroup;
  membersSelect: IMembers[] = [];
  gruposEvaluacionSelect: IEvaluationGroup[] = [];
  unidadOrganizativaSelect: IUnidadOrganizativa[] = [];
  AdminData = this.loginService.GetUserSession();

  lastEvaluatorPositionValue: string | null = null;
  uoFilterCtrl: FormControl = new FormControl();
  filteredUnidadOrganizativa: ReplaySubject<IUnidadOrganizativa[]> = new ReplaySubject<IUnidadOrganizativa[]>(1);

  SavedBodyKnowledgeFilter: IEvaluationGroupFilter
  displayedColumns: string[] = ['select', 'ficha', 'nombresApellidos', 'codPuesto', 'puesto'];
  selection = new SelectionModel<any>(true, []);
  dataSourceMembers = new MatTableDataSource<any>(this.membersSelect);

  asignaciones: any[] = [];

  private _onDestroy = new Subject<void>();

  constructor(public fb: FormBuilder,
    private CalendarService: CalendarService,
    private route: ActivatedRoute,
    private AEGService: AsignationevalgroupsService,
    private AsignationEvalGroupsService: EvalgroupsCRUDService,
    private evalAsignationService: EvalasignationService,
    private adminService: AdminService,
    private loginService: LoginService,
    private utilsService: UtilsService,
    private location: Location
  ) { }

  ngAfterViewInit(): void {
    this.dataSourceMembers.paginator = this.paginatorEvalGrupos;
  }

  async ngOnInit(): Promise<void> {
    this.utilsService.showLoading()
    this.initForm();
    const data = await this.CalendarService.getDataScheduleApi().toPromise()
    this.calendarData = data;
    await this.LoadEvalGroupsData();
    await this.loadUnidadOrganizativa(); //PROY-00013 RFC
    

    // inicializa la lista filtrada con todos los datos cargados
    this.filteredUnidadOrganizativa.next(this.unidadOrganizativaSelect.slice());

    // escucha cambios en el buscador
    this.uoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => this.filterUo());


    this.utilsService.closeLoading();
    console.log('calendarID', this.CalendarID);

  }

  initForm() {
    debugger
    this.form = this.fb.group({
      idGrupoEvaluacion: ['', Validators.required],
      idGrupoEvaluacionAsignacion: [{ value: '', disabled: true }],
      fichaEvaluador: ['', Validators.required],
      nombreEvaluador: [{ value: '', disabled: true }],
      correoEvaluador: [{ value: '', disabled: true }],
      puestoEvaluador: [{ value: '', disabled: true }],
      codPuestoEvaluador: [{ value: '', disabled: true }] 
    });
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

  async onGetEvaluadorByUO(codigo: string) {
    debugger
    console.log('Codigo Seleccionado', codigo);
    try {
      this.utilsService.showLoading();
      const dataAsignaciones = sessionStorage.getItem('asignaciones');
      this.asignaciones = dataAsignaciones ? JSON.parse(dataAsignaciones) : [];
      const self = this;
      const evalUO = this.adminService.getMembersByTeam(codigo).subscribe({
        next: (data) => {
          debugger
          console.log(data.registros[0].miembros);
          const miembros = data.registros[0].miembros;

          // Filtramos los que NO son jefes
          //self.dataSourceMembers.data = miembros.filter(miembro => miembro.jefe === false);
          //self.selection.select(...this.dataSourceMembers.data);
          //console.log('DataSource Miembros', this.dataSourceMembers.data);

          const miembrosFiltrados = miembros.filter(m => m.jefe ||
            !(self.asignaciones || []).some(a => a.evaluado.codigoFicha === m.ficha)
          );

          this.dataSourceMembers.data = miembrosFiltrados.filter(m => !m.jefe);
          this.selection.select(...this.dataSourceMembers.data);

          //const jefe = miembros.find(miembro => miembro.jefe === true);
          const jefe = miembrosFiltrados.find(miembro => miembro.jefe === true);
          console.log('Jefe Encontrado:', jefe);
          if (jefe) {
            this.form.get('fichaEvaluador').patchValue(jefe.ficha);
            this.form.get('nombreEvaluador').patchValue(jefe.apellidos+' '+jefe.nombre);
            this.form.get('puestoEvaluador').patchValue(jefe.desCargo);
            this.form.get('correoEvaluador').patchValue(jefe.correo);
            this.form.get('codPuestoEvaluador').patchValue(jefe.codCargo); 
          }else{
            this.form.get('nombreEvaluador').patchValue('');
            this.form.get('puestoEvaluador').patchValue('');
            this.form.get('correoEvaluador').patchValue('');
            this.form.get('codPuestoEvaluador').patchValue(''); 
            Swal.fire('No se encontró un jefe asignado en esta unidad organizativa', '', 'warning');
          }

          this.utilsService.closeLoading();
        },
        error: (error) => {
          console.error("Error:", error.message);
          Swal.fire("Error al enviar el recordatorio.", '', "error");
        }
      });
    } catch (error) {
      return Swal.fire('Error al cargar los datos de trabajadores', 'Por favor, inténtalo de nuevo más tarde.', "error");
    }
  }

  async LoadEvalGroupsData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalgroup = await this.AsignationEvalGroupsService.GetEvalGroupsReportCRUD().toPromise();
      const filteredEvalGroup = evalgroup.registros.sort((a: any, b: any) => b.estado - a.estado);
      this.gruposEvaluacionSelect = filteredEvalGroup;
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de grupo de evaluación', 'Por favor, inténtalo de nuevo más tarde.', "error");
    }
  }

  async loadUnidadOrganizativa(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const evalUO = await this.AsignationEvalGroupsService.GetUnidadOrganizativa().toPromise();
      const filteredUOGroup = evalUO.registros.sort((a: any, b: any) => b.codigo - a.codigo);
      this.unidadOrganizativaSelect = filteredUOGroup;
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de las unidades organizativas', 'Por favor, inténtalo de nuevo más tarde.', "error");
    }
  }

  cargaAutomaticaAsignacion() {
    debugger
    if (!this.selection || this.selection.selected.length === 0) {
      Swal.fire('Error', 'Debe seleccionar al menos un evaluado.', 'warning');
      return;
    }

    // Construir arreglo formateado desde los seleccionados
    const miembrosFormateados = this.selection.selected.map(m => ({
      ficha: m.ficha || m.codigoFicha || "",
      nombre: m.nombre || "",
      apellidos: m.apellidos || "",
      correo: m.correo || "",
      nivel: m.nivel || "",
      codCargo: m.codCargo || "",
      desCargo: m.desCargo || "",
      unidadOrganica: m.unidadOrganica || "",
      equipo: m.equipo || "",
      grupoOcupacional: m.grupoOcupacional || "",
      codigoPuesto: m.codigoPuesto || "",
      apellidosNombres: `${m.apellidos || ""} ${m.nombre || ""}`.trim(),
      codigoFicha: m.codigoFicha || "",
      nombrePuesto: m.nombrePuesto || "",
      jefe: m.jefe || false
    }));
    console.log('Miembros Formateados:', miembrosFormateados);


    const newAsignacion: any = this.form.getRawValue();
    console.log("Grupo ", newAsignacion.idGrupoEvaluacionAsignacion);
    console.log('cargaAutomaticaAsignacion');

    Swal.fire({
      title: "Aviso",
      text: `¿Estás seguro de realizar la carga automática de los evaluados?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Cargar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.evalAsignationService.PostPutCargaAutomaticaEvalAsignationReport(
          this.CalendarID,
          this.AdminData.ficha,
          this.form.get('codPuestoEvaluador').value,
          miembrosFormateados
        ).subscribe({
          next: (response) => {
            this.utilsService.closeLoading();
            Swal.fire("Asignación exitosa", "", "success");
             this.location.back(); 
          },
          error: (error) => {
            this.utilsService.closeLoading();
            console.error("Error en la asignación automática:", error);
            Swal.fire("Error en la asignación automática", "", "error");
          }
        });
      }
    });
  }



  async onSearchEvaluator(): Promise<void> {
    const currentValue = this.form.get('fichaEvaluador').value;
    debugger
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
        } else {
          Swal.fire('Ficha no encontrada', 'No se encontró información para la ficha ingresada.', 'warning');
          this.form.get('nombreEvaluador').patchValue('');
          this.form.get('correoEvaluador').patchValue('');
          this.form.get('puestoEvaluador').patchValue('');
          this.form.get('codPuestoEvaluador').patchValue('');
        }

      } catch (error) {
        this.utilsService.closeLoading();
        console.error("Error al obtener la información del trabajador:", error);
      }
    }
  }


  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceMembers.data.length;
    return numSelected === numRows;
  }

  /** Retorna true si algunas filas están seleccionadas, pero no todas */
  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceMembers.data.length;
    return numSelected > 0 && numSelected < numRows;
  }

  /** Selecciona o deselecciona todas las filas */
  masterToggle(event: any) {
    if (event.checked) {
      this.selection.select(...this.dataSourceMembers.data);
    } else {
      this.selection.clear();
    }
  }

  /** Alterna selección individual */
  toggleSelection(row: any) {
    this.selection.toggle(row);
  }

}
