import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GerencyteamsmultiselectService {
  $GerencyArray = new EventEmitter<string>();
  $TeamArray = new EventEmitter<string>();
  $Gerencymultiselectswitch = new EventEmitter<boolean>();
  $Teammultiselectswitch = new EventEmitter<boolean>();

  constructor() {
    this.$Gerencymultiselectswitch.emit(false);
    this.$Teammultiselectswitch.emit(false);
   }

  CloseAllSelects(){
    this.$Gerencymultiselectswitch.emit(false);
    this.$Teammultiselectswitch.emit(false);
  }
}
