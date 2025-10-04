import { HttpClient, HttpResponse } from '@angular/common/http';
import { EventEmitter, Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  $ResetFiltersValues = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient) { }

  ResetAllFilterValues(): void{
    this.$ResetFiltersValues.emit(true);
  }
  
  GetConsolidatedExcel(codTipo: string, codCalendario: string): Observable<Blob> {
    return this.http.get(`${environment.GetConsolidate}${codTipo}/${codCalendario}`, { responseType: 'blob', observe: 'response' }).pipe(
      map((response: HttpResponse<Blob>) => response.body as Blob)
    );
  }

  showLoading() {
    return Swal.fire({
      html: '<h2>Cargando...</h2>',
      imageUrl: '/competencias/assets/img/loading.gif',
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
      width: '20rem',
      imageHeight: 100, 
      imageWidth: 100,
    });
  }
  

  GetEvaluatorStatusForPhase(Tipo: string, TipoId: string, Id: string, codCalend: string){
    if (isDevMode()) {
      return this.http.get(`${environment.GetEvaluatorStatusForPhase}`);
    } else {
      return this.http.get(`${environment.GetEvaluatorStatusForPhase}/${Tipo}/${TipoId}/${Id}/${codCalend}`);
    }

  }

  closeLoading(){
    Swal.close();
  }

  GetFormatedDate(dateString: string): string {
    const datePart = dateString.split(' ')[0];
    const [year, month, day] = datePart.split('-');
  
    return `${day}/${month}/${year}`;
  }
  
  DecodeDate(texto: string):string {
    const date = new Date(texto);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  

  GetFormatedDateYYYYMMDD(dateString: string): string{
    const date = new Date(dateString);
  
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
  
    return `${year}-${month}-${day}`;
  }

  formatDateToDDMMYYYY(dateString: string): string {
    const [year, month, day] = dateString.split('-');
  
    return `${day}/${month}/${year}`;
  }

  padLeftZeros(value: string | number): string {
    const strValue = value.toString();
    return strValue.padStart(8, '0');
  }
}
