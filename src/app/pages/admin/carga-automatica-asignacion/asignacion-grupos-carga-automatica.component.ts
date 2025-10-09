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
import { EvalgroupsService } from 'src/app/services/evalgroups/evalgroups.service';


@Component({
  selector: 'asignacion-grupos-carga-automatica',
  templateUrl: './asignacion-grupos-carga-automatica.component.html',
  styleUrls: ['./asignacion-grupos-carga-automatica.component.css']
})
export class AsignacionGruposCargaAutomaticavalComponent {
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  @ViewChild('paginatorMembers') paginatorEvalGrupos: MatPaginator;
  calendarData!: ISchedule
  form: FormGroup;
  membersSelect: IMembers[] = [];
  gruposEvaluacionSelect: IEvaluationGroup[] = [];
  unidadOrganizativaSelect: IUnidadOrganizativa[] = [];
  AdminData = this.loginService.GetUserSession();

  SavedBodyKnowledgeFilter: IEvaluationGroupFilter
  displayedColumns: string[] = ['select', 'ficha', 'nombresApellidos', 'codPuesto', 'puesto'];
  selection = new SelectionModel<any>(true, []);
  //dataSourceMembers = new MatTableDataSource<any>(this.membersSelect);
  dataSourceMembers = new MatTableDataSource<any>([]);

  lastEvaluatorPositionValue: string | null = null;
  uoFilterCtrl: FormControl = new FormControl();
  filteredUnidadOrganizativa: ReplaySubject<IUnidadOrganizativa[]> = new ReplaySubject<IUnidadOrganizativa[]>(1);

  private _onDestroy = new Subject<void>();

  constructor(public fb: FormBuilder,
    private CalendarService: CalendarService,
    private route: ActivatedRoute,
    private AEGService: AsignationevalgroupsService,
    private AsignationEvalGroupsService: EvalgroupsCRUDService,
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
      codigo: ['', Validators.required]
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

  /* async onGetEvaluadorByUO(codigo: string) {
    debugger
    this.utilsService.showLoading();
    console.log('Codigo Seleccionado', codigo);
    try {
      const evalUO = this.adminService.getMembersByTeam(codigo).subscribe({
        next: (data) => {
          console.log(data.registros[0].miembros);
          this.utilsService.showLoading();
          //this.dataSourceMembers.data = data.registros[0].miembros.filter(miembro => miembro.jefe === false);
          data.registros[0].miembros = data.registros[0].miembros.filter(miembro => miembro.jefe === false);
          //console.log('DataSource Miembros',this.dataSourceMembers.data);
          debugger
          this.AEGService.validarDataCargaAutomaticaEvalsGroups(data.registros[0].miembros, this.form.get('idGrupoEvaluacion').value,
            this.CalendarID, this.AdminData.ficha).subscribe({
              next: (data) => {
                debugger
                //this.dataSourceMembers.data = data.registros[0].miembros.filter(miembro => miembro.jefe === false);
                this.dataSourceMembers.data = data.datos.listadoCorrectos;
                this.selection.select(...this.dataSourceMembers.data);
                console.log('DataSource Miembros', this.dataSourceMembers);
                this.utilsService.closeLoading();
              },
              error: (error) => {
                this.utilsService.closeLoading();
                console.error("Error en la asignación automática:", error);
                Swal.fire("Error en la asignación automática", "", "error");
              }
            });

        },
        error: (error) => {
          console.error("Error:", error.message);
          Swal.fire("Error al enviar el recordatorio.", '', "error");
        }
      });
      this.utilsService.closeLoading();
    } catch (error) {
      return Swal.fire('Error al cargar los datos de trabajadores', 'Por favor, inténtalo de nuevo más tarde.', "error");
    }
  } */

  async onGetEvaluadorByUO(codigo: string) {
  debugger;
  console.log('Codigo Seleccionado', codigo);
  try {
    this.utilsService.showLoading();
    this.adminService.getMembersByTeam(codigo).subscribe({
      next: (data) => {
        debugger;
        const miembros = data.registros[0].miembros;

        // Filtrar los que NO son jefes y mapear al formato de la tabla
        this.dataSourceMembers.data = miembros
          .filter(miembro => miembro.jefe === false)
          .map(miembro => {
            return {
              trabajador: {
                codigoFicha: miembro.trabajador && miembro.trabajador.ficha 
                              ? miembro.trabajador.ficha 
                              : miembro.ficha || '',
                apellidosNombres: miembro.trabajador && miembro.trabajador.apellidosNombres
                                   ? miembro.trabajador.apellidosNombres
                                   : (miembro.apellidos ? miembro.apellidos : '') + ' ' + (miembro.nombre ? miembro.nombre : ''),
                codigoPuesto: miembro.trabajador && miembro.trabajador.codCargo
                               ? miembro.trabajador.codCargo
                               : miembro.codCargo || '',
                nombrePuesto: miembro.trabajador && miembro.trabajador.desCargo
                               ? miembro.trabajador.desCargo
                               : miembro.desCargo || ''
              }
            };
          });

        this.selection.select(...this.dataSourceMembers.data);
        console.log('DataSource Miembros', this.dataSourceMembers.data);

        // Buscar jefe y setear en el form
        const jefe = miembros.find(m => m.jefe === true);
        if (jefe && this.form.get('nombreEvaluador')) {
          this.form.get('nombreEvaluador').patchValue(jefe.codigo); // o jefe.trabajador.codigo si lo trae dentro
        }

        this.utilsService.closeLoading();
      },
      error: (error) => {
        console.error("Error:", error.message);
        Swal.fire("Error al enviar el recordatorio.", '', "error");
      }
    });
  } catch (error) {
    return Swal.fire(
      'Error al cargar los datos de trabajadores',
      'Por favor, inténtalo de nuevo más tarde.',
      "error"
    );
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
    let miembrosFormateados = [];

    if (this.selection && this.selection.selected.length > 0) {
    miembrosFormateados = this.selection.selected.map(m => ({
      codigoFicha: m.trabajador.codigoFicha,
      apellidosNombres: m.trabajador.apellidosNombres,
      codigoPuesto: m.trabajador.codigoPuesto,
      nombrePuesto: m.trabajador.nombrePuesto
    }));
  } else {
    Swal.fire('Error', 'Debe seleccionar al menos un evaluado.', 'warning');
    return;
  }
    const newAsignacion: any = this.form.getRawValue()
    debugger
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
      this.utilsService.showLoading();
      this.AEGService.PostAsignationCargaAutomaticaEvalsGroups(miembrosFormateados, this.form.get('idGrupoEvaluacion').value, this.CalendarID, this.AdminData.ficha).subscribe({
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
    })
  }



  /** Selecciona todas las filas si no están todas seleccionadas, de lo contrario las deselecciona */
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
