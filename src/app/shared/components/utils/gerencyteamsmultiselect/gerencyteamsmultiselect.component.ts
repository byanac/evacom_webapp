import { Subscription } from "rxjs";
import { Component, HostListener, OnDestroy, OnInit, Renderer2 } from "@angular/core";
import { IGerency } from "src/app/interfaces/IGerency";
import { ITeam } from "src/app/interfaces/ITeam";
import { GerencyService } from "src/app/services/gerency/gerency.service";
import { GerencyteamsmultiselectService } from "src/app/services/gerencyteamsmultiselect/gerencyteamsmultiselect.service";
import { TeamService } from "src/app/services/team/team.service";
import { UtilsService } from "src/app/services/utils/utils.service";

@Component({
  selector: "app-gerencyteamsmultiselect",
  templateUrl: "./gerencyteamsmultiselect.component.html",
  styleUrls: ["./gerencyteamsmultiselect.component.css"],
})
export class GerencyteamsmultiselectComponent implements OnInit, OnDestroy {
  private GerencyArraySubscription: Subscription = new Subscription();
  private TeamSelectSubscription: Subscription = new Subscription();
  private GerencySelectSubscription: Subscription = new Subscription();
  private utilsSubscription: Subscription = new Subscription();

  Teamdata!: ITeam[] | null;
  Teamdatabkup!: ITeam[] | null;
  Teamcheckboxesdisabled: boolean = false;
  Teamallcheckbox: boolean = true;
  Teammultiselectswitch: boolean = false;
  TeamButtonDisabled: boolean = false;
  TeamArrayToSend: any = [];
  RemoveTeamsDiv: boolean = true;

  gerencydata!: IGerency[];
  gerencyabkup!: IGerency[];
  Gerencycheckboxesdisabled: boolean = false;
  Gerencyallcheckbox: boolean = true;
  Gerencymultiselectswitch: boolean = false;
  GerencybuttonDisabled: boolean = false;
  Gerencycheckboxeschecked: boolean = false;
  GerencyArrayToSend: any = [];

  constructor(
    private gerencyservice: GerencyService,
    private teamservice: TeamService,
    private gerencyteamservice: GerencyteamsmultiselectService,
    private utilsService: UtilsService,
    private renderer: Renderer2
  ) {}

  ngOnDestroy(): void {
    this.GerencyArraySubscription.unsubscribe();
    this.TeamSelectSubscription.unsubscribe();
    this.GerencySelectSubscription.unsubscribe();
    this.utilsSubscription.unsubscribe();
  }

  async ngOnInit(): Promise<void> {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await this.loadGerencyData();

      this.GerencyArraySubscription = this.gerencyteamservice.$GerencyArray.subscribe(async (data) => {
        const TeamArray: string = data;
        if (TeamArray === null) {
          this.DeactivateAndCleanTeamsCheckbox();
        }
        await this.loadTeamData(TeamArray);
      });

      this.GerencySelectSubscription = this.gerencyteamservice.$Gerencymultiselectswitch.subscribe((data) => {
        this.Gerencymultiselectswitch = data;
        this.GerencybuttonDisabled = true;
      });

      this.TeamSelectSubscription = this.gerencyteamservice.$Teammultiselectswitch.subscribe((data) => {
        this.Teammultiselectswitch = data;
      });

      this.utilsSubscription = this.utilsService.$ResetFiltersValues.subscribe((value: boolean) => {
        if (value) {
          this.DeactivateAndCleanTeamsCheckbox();
          this.GerencyArrayToSend = [];
          this.gerencyteamservice.$GerencyArray.emit(this.GerencyArrayToSend);
          this.Gerencycheckboxeschecked = false;
        }
      });

      this.utilsService.$ResetFiltersValues.subscribe((value: boolean) => {
        if (value) {
          this.CleanAll();
        }
      })
    } catch (error) {
      console.error("Error initializing component:", error);
    }
  }

  private async loadGerencyData(): Promise<void> {
    try {
      const value = await this.gerencyservice.getDataGerencyApi().toPromise();
      this.gerencydata = [value];
      this.gerencyabkup = [value];
      //console.log('Gerencias cargadas:', this.gerencydata);
      this.GerencybuttonDisabled = true;
    } catch (error) {
      console.error("Error loading gerency data:", error);
      this.gerencydata = [{ registros: [] }] as any;
      this.gerencyabkup = this.gerencydata;
    }
  }

  private async loadTeamData(TeamArray: string): Promise<void> {
    try {
      const value = await this.teamservice.getDataTeamApi(TeamArray).toPromise();
      this.Teamdata = [value];
      this.Teamdatabkup = [value];
    } catch (error) {
      console.error("Error loading team data:", error);
    }
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    this.Gerencymultiselectswitch = false;
    this.Teammultiselectswitch = false;
    this.GerencybuttonDisabled = true;
    this.renderer.removeClass(document.body, 'overflow-hidden');
  }

  OpenGerencymultiselectmenu(): void {
    this.Gerencymultiselectswitch = !this.Gerencymultiselectswitch;
    if (this.Gerencymultiselectswitch) {
      this.renderer.addClass(document.body, 'overflow-hidden');
    }
  }

  OpenTeamymultiselectmenu(): void {
    if (this.Teamdata != null) {
      this.Teammultiselectswitch = !this.Teammultiselectswitch;
      if (this.Teammultiselectswitch) {
        this.GerencybuttonDisabled = false;
        this.Gerencymultiselectswitch = false;
        this.renderer.addClass(document.body, 'overflow-hidden');
      } else {
        this.GerencybuttonDisabled = true;
      }
    }
  }

  MarkAllActivateTeamsCheckbox() {
    this.Gerencycheckboxesdisabled = true;
    this.Gerencyallcheckbox = false;
    this.TeamButtonDisabled = true;
    this.Teamdata = this.Teamdatabkup;
  }

  ActivateTeamsCheckbox() {
    this.TeamButtonDisabled = true;
  }

  DeactivateAndCleanTeamsCheckbox() {
    this.Gerencycheckboxesdisabled = false;
    this.Gerencyallcheckbox = true;
    this.Teammultiselectswitch = false;
    this.TeamButtonDisabled = false;
    this.TeamArrayToSend = [];
    this.gerencyteamservice.$TeamArray.emit(this.TeamArrayToSend);
  }

  CleanAll(){
    //console.log('BORRADO')
    this.DeactivateAndCleanTeamsCheckbox();
    this.GerencyArrayToSend = [];
    this.Gerencycheckboxeschecked = true;
    setTimeout(() => {
      this.Gerencycheckboxeschecked = false;
    }, 100);
   
  }

  onChangeGerency(value: string, index: number | null): void {
    switch (value) {
      case "all":
        this.MarkAllActivateTeamsCheckbox();
        this.GerencyArrayToSend = ['00000000'];
        this.Teamcheckboxesdisabled = false;
        this.Gerencycheckboxeschecked = true;
        this.Teamallcheckbox = true;
        break;
      case "deleteall":
          this.DeactivateAndCleanTeamsCheckbox();
          this.GerencyArrayToSend = [];
          this.Gerencycheckboxeschecked = false;
        break;
      case "":
        this.DeactivateAndCleanTeamsCheckbox();
        break;
      default:
        this.Teamcheckboxesdisabled = false;
        this.Teamallcheckbox = true;
        this.TeamArrayToSend = [];
        const existingIndex = this.GerencyArrayToSend.findIndex((item: string) => item === value);

        if (existingIndex !== -1) {
          this.GerencyArrayToSend.splice(existingIndex, 1);
        } else {
          const registros = this.gerencydata[0].registros || [];
          const selectedItem = (index !== null && index >= 0) ? registros[index] : null;
          if (selectedItem) {
            this.GerencyArrayToSend.push(selectedItem.codigo);
          }
        }
        this.ActivateTeamsCheckbox();
        break;
    }

    this.gerencyteamservice.$GerencyArray.emit(this.GerencyArrayToSend);
    if (this.GerencyArrayToSend.length === 0) {
      this.DeactivateAndCleanTeamsCheckbox();
    }
  }

  onChangeTeam(value: string, index: number | null | undefined): void {
    switch (value) {
      case "all":
        this.Teamcheckboxesdisabled = true;
        this.Teamallcheckbox = false;
        this.TeamArrayToSend = ['00000000'];
        break;
      case "":
        this.Teamcheckboxesdisabled = false;
        this.Teamallcheckbox = true;
        this.TeamArrayToSend = [];
        break;
      default:
        const existingIndex = this.TeamArrayToSend.findIndex((item) => item === value);
        if (existingIndex !== -1) {
          this.TeamArrayToSend.splice(existingIndex, 1);
        } else {
          const teamRegistros = this.Teamdata[0].registros || [];
          const selectedTeam = (index !== null && index !== undefined && index >= 0) ? teamRegistros[index] : null;
          if (selectedTeam) {
            this.TeamArrayToSend.push(selectedTeam.codigo);
          }
        }
    }

    this.gerencyteamservice.$TeamArray.emit(this.TeamArrayToSend);
  }
}
