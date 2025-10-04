import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { ILoginData } from 'src/app/interfaces/ILoginData';
import { LoginService } from 'src/app/services/auth/login.service';
import { Router } from '@angular/router'
import { ConfigurationService } from 'src/app/services/configuration.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {
  DataFromsessionStorage:ILoginData = this.loginService.GetUserSession();
  showSubMobile: boolean;
  showdeskOptionMenu: boolean;
  showSubMenu: boolean;
  displayAdminReportOptions: boolean;
  displayEvaluationOptions: boolean;
  ShowMenu: boolean = false;
  private subscription: Subscription;
  MobileMenuToggled: boolean = false;
  
  constructor(private loginService: LoginService, private renderer: Renderer2, private router: Router, public ConfigurationService: ConfigurationService, ) { }

  ngOnInit() {
    this.subscription = this.ConfigurationService.getToggleMobileMenu().subscribe(value => {
      this.MobileMenuToggled = value;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  togglemobilemenu():void{
    !this.MobileMenuToggled ? this.ConfigurationService.setToggleMobileMenuVisible() : this.ConfigurationService.setToggleMobileMenuHided();
  }

  TurnOffMenu(): void{
    this.renderer.setStyle(document.body, 'overflow-y', 'auto');
    this.showdeskOptionMenu = false;
    this.showSubMobile = false;
    this.displayAdminReportOptions = false
    this.displayAdminReportOptions = false
    this.displayEvaluationOptions = false
  }

  goHome(){
    return this.router.navigateByUrl('/home');
  }

  toggleSubMenu():void{
    this.showSubMenu = !this.showSubMenu; 
  }

  ToggleMenu(Event: Event) {
    this.ConfigurationService.ToggleMenu();
    this.ShowMenu = !this.ShowMenu
    
    ////console.log(this.ConfigurationService.getMenuViewMode())
    if(this.ConfigurationService.getMenuViewMode() === 'Static'){
      this.ConfigurationService.getStaticMenuDeactivated().subscribe(data => data ? this.renderer.setStyle(document.body, 'overflow-y', 'auto') : this.renderer.setStyle(document.body, 'overflow-y', 'hidden'))
    }else if(this.ConfigurationService.getMenuViewMode() === 'Overlay'){
      this.ConfigurationService.getMenuActiveMobile.subscribe(data => !data ?  this.renderer.setStyle(document.body, 'overflow-y', 'auto') : this.renderer.setStyle(document.body, 'overflow-y', 'hidden'))
    }
    Event.preventDefault();
  }


  closeSesion(){
    sessionStorage.clear();
    return this.router.navigate(['/login']);
  }
}
