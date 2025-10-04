import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { EvalgroupsCRUDService } from 'src/app/services/evalgroupsCRUD/evalgroups-crud.service';
import { IUnidadOrganizativa } from 'src/app/interfaces/IUnidadOrganizativa';
import Swal from 'sweetalert2';
import { GerencyService } from 'src/app/services/gerency/gerency.service';
import { TeamService } from 'src/app/services/team/team.service';

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


  async LoadData(skipLoading: boolean = false): Promise<any> {
    try {
      if (!skipLoading) {
        this.utilsService.showLoading();
      }
      const evalUO = await this.AsignationEvalGroupsService.GetUnidadOrganizativa().toPromise();
      const filteredUOGroup = evalUO.registros.sort((a: any, b: any) => b.codigo - a.codigo);
      this.unidadOrganizativaSelect = filteredUOGroup;
      if (!skipLoading) {
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

  onSincronizar() {
    debugger
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
