import { Component, OnInit, isDevMode } from '@angular/core';
import 'sweetalert2/dist/sweetalert2.css'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'SED-AEPC-WebApp';

  constructor() { }

  ngOnInit(): void {
    if (isDevMode()) {
      ////console.log('Estamos en modo desarrollador')
    } else {
      ////console.log('Estamos en modo producción')
    }
  }
}
