import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Observable } from "rxjs";
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Configuration } from 'src/app/interfaces/configuration.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  Configuration: Configuration = new Configuration();
  Configuration$: Observable<Configuration> = new Observable<Configuration>();
  MenuActiveMobile: boolean = false;
  MenuActiveMobile$: Observable<boolean> = new Observable<boolean>();
  OverlayMenuActive: boolean = false;
  OverlayMenuActive$: Observable<boolean> = new Observable<boolean>();
  StaticMenuInactive: boolean = true;
  StaticMenuInactive$: Observable<boolean> = new Observable<boolean>();

  DataFromsessionStorage = JSON.parse(sessionStorage.getItem('userdata'))
  Token = sessionStorage.getItem('token')
  HideBackgroundImage: boolean = false;
  ShowNavBar: boolean = true;

  constructor(private router: Router, private utilsService: UtilsService, public ConfigurationService: ConfigurationService) {
    
   }

  
  ngOnInit(): any {
    this.Configuration$ = this.ConfigurationService.getConfiguration;
    this.Configuration$.pipe().subscribe( Configuration => this.Configuration = Configuration );
    this.MenuActiveMobile$ = this.ConfigurationService.getMenuActiveMobile;
    this.MenuActiveMobile$.pipe().subscribe( MenuActiveMobile => this.MenuActiveMobile = MenuActiveMobile);
    this.OverlayMenuActive$ = this.ConfigurationService.getOverlayMenuActive;
    this.OverlayMenuActive$.pipe().subscribe( OverlayMenuActive => this.OverlayMenuActive = OverlayMenuActive);
    this.StaticMenuInactive$ = this.ConfigurationService.getStaticMenuInactive;
    this.StaticMenuInactive$.pipe().subscribe(Inactive => this.StaticMenuInactive = Inactive);

    if(this.DataFromsessionStorage === null || this.Token === null){
      return this.router.navigate(['/login']);
    }

    this.updateBackgroundImage(this.router.url);

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationStart) {
        this.updateBackgroundImage(evt.url);
      }
    });
  }

  updateBackgroundImage(url: string): void {
    this.utilsService.closeLoading();
    //////console.log(url)
    if (url === '/home') {
      this.HideBackgroundImage = false;
    } 
    else if (url === '/home/formato-imp-evaluacion' || url === '/home/descarga-masiva') {
      this.HideBackgroundImage = true;
      this.ShowNavBar = false;
    }
    else if (url.startsWith('/home/') && url !== '/home') {
      this.HideBackgroundImage = true;
    }  
    else{
      this.HideBackgroundImage = false;
    }
  }
}
