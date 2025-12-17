import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { EvalgroupsCRUDService } from 'src/app/services/evalgroupsCRUD/evalgroups-crud.service';
import { IUnidadOrganizativa } from 'src/app/interfaces/IUnidadOrganizativa';
import Swal from 'sweetalert2';
import { GerencyService } from 'src/app/services/gerency/gerency.service';
import { TeamService } from 'src/app/services/team/team.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

/* INI PROY-00013 RFC */
@Component({
  selector: 'sincronizacion-unidad-organizativa',
  templateUrl: './sincronizacion-unidad-organizativa.component.html',
  styleUrls: ['./sincronizacion-unidad-organizativa.component.css']
})
export class SincronizacionUnidadOrganizativaComponent implements OnInit {
  ShowMainteanceModal: boolean = false;
  Add: boolean = false;
  Type: string = "";
  nameButton: string = "";
  Indicadores: boolean = false;
  Entregables: boolean = false;
  TypeToCreate: boolean = false;
  SelectedItemID: number;
  unidadOrganizativaSelect: IUnidadOrganizativa[] = [];  //PROY-00013 RFC
  dataSourceSincronizacion = new MatTableDataSource<any>([]);
  @ViewChild('paginatorSincronizacion') paginatorSincronizacion: MatPaginator;
  @ViewChild('tablaDetalle', { read: MatSort }) sortDetalle!: MatSort;

  displayedColumns: string[] = ['codigo', 'nombreCorto', 'nombre', 'fecha'];

  constructor(private router: Router,
    private AsignationEvalGroupsService: EvalgroupsCRUDService,
    private gerencyService: GerencyService,
    private teamService: TeamService,
    private utilsService: UtilsService) { }

  async ngOnInit(): Promise<any> {
    this.Type = 'Sincronización Automatica de Unidades Organizativas';
    this.nameButton = 'Sincronizar con SAP'
    this.Entregables = true;
    this.LoadData();
  }

      applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSourceSincronizacion.filter = filterValue.trim().toLowerCase(); 
  if (this.dataSourceSincronizacion.paginator) {
    this.dataSourceSincronizacion.paginator.firstPage();
  }
}

  async LoadData(skipLoading: boolean = false): Promise<any> {
    try {
      if (!skipLoading) {
        this.utilsService.showLoading();
      }
      const evalUO = await this.AsignationEvalGroupsService
        .GetUnidadOrganizativa()
        .toPromise();

      const filteredUOGroup = evalUO.registros
        .sort((a: any, b: any) => b.codigo - a.codigo);

      this.dataSourceSincronizacion.data = filteredUOGroup;



      if (!skipLoading) {
         this.dataSourceSincronizacion.filterPredicate = (data: any, filter: string) => {
        const dataStr = (
                (data.codigo || '') +          // 1. Código (ID)
                (data.nombreCorto || '') +          // 2. Título
                (data.nombre || '')       // 3. Descripción
            ).toLowerCase(); // Todo a minúsculas
            return dataStr.indexOf(filter) !== -1;
        };
        this.utilsService.closeLoading();
      }
    } catch (error) {
      return Swal.fire(
        'Error al cargar los datos de las unidades organizativas',
        'Por favor, inténtalo de nuevo más tarde.',
        "error"
      );
    }
  }

  ngAfterViewInit(): void {
    this.dataSourceSincronizacion.paginator = this.paginatorSincronizacion;
    if (this.sortDetalle) {
      this.dataSourceSincronizacion.sort = this.sortDetalle;
      this.configureSortingDataAccessor();
    }
  }


  configureSortingDataAccessor() {
    this.dataSourceSincronizacion.sortingDataAccessor = (item: any, property: string) => {
      switch (property) {
        // Reescrito de forma limpia y concisa
        case 'codigo': return item.codigo;
        case 'nombreCorto': return item.nombreCorto;
        case 'nombre': return item.nombre;
        case 'fecha': return item.fecha;
        default:
          const value = item[property];
          return (typeof value === 'string') ? value.toLowerCase() : value;
      }
    };
  }


  onSincronizar() {
    Swal.fire({
      title: "Aviso",
      text: `Está acción actualizará la información de Unidades Organizativas ¿Desea continuar?`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: "Cargar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.value) {
        this.utilsService.showLoading();
        this.gerencyService.UpdateGerencyAPI().subscribe({
          next: (dataGerencia) => {
            console.log('Gerencias actualizadas:', dataGerencia);
            this.teamService.UpdateTeamAPI().subscribe({
              next: (dataEquipos) => {
                console.log('Equipos actualizados:', dataEquipos);
                Swal.fire({
                  title: 'Actualización completa',
                  text: 'Gerencias y Equipos actualizados correctamente',
                  type: 'success',
                  confirmButtonText: 'Aceptar',
                  allowOutsideClick: false
                }).then(() => {
                  //this.utilsService.closeLoading();
                });
                this.LoadData(true);
              },
              error: (errorEquipos) => {
                console.error('Error al cargar equipos:', errorEquipos.message);
                Swal.fire('Error al cargar equipos.', '', 'error');
                this.utilsService.closeLoading();
              }
            });
          },
          error: (errorGerencias) => {
            console.error('Error al cargar gerencias:', errorGerencias.message);
            Swal.fire('Error al cargar gerencias.', '', 'error');
            this.utilsService.closeLoading();
          }
        });
      }
    });
  }


  // Paginación
  currentPage: number = 1;
  itemsPerPage: number = 10;

  get paginatedUnidadOrganizativa(): IUnidadOrganizativa[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.unidadOrganizativaSelect.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.unidadOrganizativaSelect.length / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  /* FIN PROY-00013 RFC */


}
