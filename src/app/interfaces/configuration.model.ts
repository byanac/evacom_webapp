export class Configuration{
    inputStyle: string;
    dark: boolean;
    theme: string;
    ripple: boolean;

    constructor(){
        this.inputStyle = '';
        this.dark = true;
        this.theme = '';
        this.ripple = true;
    }

    get getInputStyle(){
        return this.inputStyle;
    }
    
    set setInputStyle(InputStyle: string){
        this.inputStyle = InputStyle;
    }

    get getDark(){
        return this.dark;
    }
    
    set setDark(Dark: boolean){
        this.dark = Dark;
    }

    get getTheme(){
        return this.theme;
    }

    set setTheme(Theme: string){
        this.theme = Theme;
    }

    get getRipple(){
        return this.ripple;
    }

    set setRipple(Ripple: boolean){
        this.ripple = Ripple;
    }
}