import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { Configuration } from "../interfaces/configuration.model";

@Injectable({
    providedIn: 'root'
})
export class ConfigurationService {

    MenuMode: string = 'static';
    MenuViewMode: string = "";

    private Configuration: BehaviorSubject<Configuration> = new BehaviorSubject<Configuration>(new Configuration());
    private ConfigurationSubject = new Subject<Configuration>();
    ConfigurationSubject$ = this.ConfigurationSubject.asObservable();

    private MenuActiveMobile: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private MenuActiveMobileSubject = new Subject<boolean>();
    MenuActiveMobileSubject$ = this.MenuActiveMobileSubject.asObservable();

    private OverlayMenuActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private OverlayMenuActiveSubject = new Subject<boolean>();
    OverlayMenuActiveSubject$ = this.OverlayMenuActiveSubject.asObservable();

    private StaticMenuInactive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    private StaticMenuInactiveSubject = new Subject<boolean>();
    StaticMenuInactiveSubject$ = this.StaticMenuInactiveSubject.asObservable();

    private TopMenuActive: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private TopMenuActiveSubject = new Subject<boolean>();
    TopMenuActiveSubject$ = this.TopMenuActiveSubject.asObservable();

    private TopMenuButtonClick: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private TopMenuButtonClickSubject = new Subject<boolean>();
    TopMenuButtonClickSubject$ = this.TopMenuButtonClickSubject.asObservable();

    private TopMenuLeaving: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private TopMenuLeavingSubject = new Subject<boolean>();
    TopMenuLeavingSubject$ = this.TopMenuLeavingSubject.asObservable();
    
    private ToggleMobileMenu: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    ToggleMobileMenu$: Observable<boolean> = this.ToggleMobileMenu.asObservable();

    constructor(){
        let Config: Configuration = new Configuration();
        Config.inputStyle = 'outlined';
        Config.dark = false;
        Config.theme = 'saga-blue';
        Config.ripple = true;
        this.setConfiguration = Config;
    }

    set setConfiguration(Config: Configuration){ this.Configuration.next(Config); }

    get getConfiguration(){ return this.Configuration.asObservable(); }

    set setMenuActiveMobile(Active: boolean){ this.MenuActiveMobile.next(Active); }

    get getMenuActiveMobile(){ return this.MenuActiveMobile.asObservable(); }

    set setOverlayMenuActive(Active: boolean){ this.OverlayMenuActive.next(Active); }

    get getOverlayMenuActive(){ return this.OverlayMenuActive.asObservable(); }

    set setStaticMenuInactive(Inactive: boolean){ this.StaticMenuInactive.next(Inactive); }

    get getStaticMenuInactive(){ return this.StaticMenuInactive.asObservable(); }

    set setTopMenuActive(Active: boolean){ this.TopMenuActive.next(Active); }

    get getTopMenuActive(){ return this.TopMenuActive.asObservable(); }

    set setTopMenuButtonClick(Flag: boolean){ this.TopMenuButtonClick.next(Flag); }

    get getTopMenuButtonClick(){ return this.TopMenuButtonClick.asObservable(); }

    set setTopMenuLeaving(Flag: boolean){ this.TopMenuLeaving.next(Flag); }

    get getTopMenuLeaving(){ return this.TopMenuLeaving.asObservable(); }

    IsMenuModeOverlay(){
        return this.MenuMode === 'overlay';
    }

    IsMenuModeStatic() {
        return this.MenuMode === 'static';
    }

    ToggleMenu(){
        if (this.IsDesktop()) {
            if (this.MenuMode === 'overlay') {
                if(this.MenuActiveMobile.getValue()) {
                  this.setOverlayMenuActive = true;
                }

                this.setOverlayMenuActive = !this.OverlayMenuActive.getValue();
                this.setMenuActiveMobile = false;
            }
            else if (this.MenuMode === 'static') {
                this.setStaticMenuInactive = !this.StaticMenuInactive.getValue();
            }
            this.MenuViewMode = 'Static'
        }
        else {
            this.setMenuActiveMobile = !this.MenuActiveMobile.getValue();
            this.setTopMenuActive = false;
            this.MenuViewMode = 'Overlay'
        }
    }

    ToggleTopMenu() {
        this.setTopMenuButtonClick = true;
        this.setMenuActiveMobile = false;

        if (this.TopMenuActive.getValue()) this.HideTopMenu();
        else this.setTopMenuActive = true;
    }

    HideTopMenu() {
        this.setTopMenuLeaving = true;
        setTimeout(() => {
            this.setTopMenuActive = false;
            this.setTopMenuLeaving = false;
        }, 1);
    }

    
    setToggleMobileMenuVisible(): void {
        this.ToggleMobileMenu.next(true);;
    }

    setToggleMobileMenuHided(): void {

        this.ToggleMobileMenu.next(false);
    }

    getToggleMobileMenu(): Observable<boolean> {
        return this.ToggleMobileMenu$;
    }

    getStaticMenuDeactivated(): Observable<boolean>{
        return this.getStaticMenuInactive
    }

    getMenuViewMode(): string {
        return this.MenuViewMode
    }

    IsDesktop(){ return window.innerWidth > 992; }
}
