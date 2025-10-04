import { UtilsService } from './../../../services/utils/utils.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CalcrulesService } from 'src/app/services/calcrules/calcrules.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ParametrizationService } from 'src/app/services/parametrization/parametrization.service';
import { ICalendarCalcRules } from 'src/app/interfaces/ICalendarCalcRules';

@Component({
  selector: 'app-registro-reglas-calculo',
  templateUrl: './registro-reglas-calculo.component.html',
  styleUrls: ['./registro-reglas-calculo.component.css']
})
export class RegistroReglasCalculoComponent implements OnInit {
  CalendarID: string = this.route.snapshot.paramMap.get('CalendarID');
  data: any;
  CalendarData: any = [];
  form: FormGroup;
  evaluadores: any[] = [
    { tipo: 'Jefe', peso: 100, cantidad: 1 }
  ];
  
  loading: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private calculationRulesService: CalcrulesService, 
    private utilsService: UtilsService, 
    private route: ActivatedRoute,
    private router: Router,
    private parametrizationService: ParametrizationService) {}

  ngOnInit() {
    this.initForm();
  }

  async initForm(): Promise<void> {
    this.utilsService.showLoading();
    this.form = this.fb.group({
      nombre: ['', [Validators.required]],
      tipoEvaluacion: [{ value: '', disabled: true }, Validators.required],
      cantidadSubordinados: [3, [Validators.required, Validators.min(1), Validators.max(10)]],
    });
    await this.LoadCalendarData();
    await this.LoadCalcRules();
  }
 

  async LoadCalcRules(): Promise<void>{
    try {
      this.data = await this.calculationRulesService.GetCalendarDataForCalcRules(this.CalendarID).toPromise();
      //console.log(this.data.registros);
  
      if (this.data.registros != null) {
        this.form.get('nombre').patchValue(this.data.registros.calendario.vNombre);
        this.form.get('tipoEvaluacion').patchValue(this.data.registros.calendario.tipo);
        this.handleTipoEvaluacionChange(this.data.registros.calendario.tipo);
        this.loading = true;
      } else {
        //console.log('cargando datos predefinidos')
        this.evaluadores = [
          { tipo: 'Jefe', peso: 70, cantidad: 1 },
          { tipo: 'Subordinados', peso: 30, cantidad: 3 }
        ]
        this.loading = true;
      }
    } catch (error) {
      Swal.fire(
        'Error en obtención de datos',
        'Error en obtención de datos del calendario seleccionado.',
        'error'
      ).then(() => {
        this.router.navigateByUrl(`/home/parametrizar-calendario/${this.CalendarID}`);
      });
    }
  }

  async LoadCalendarData(): Promise<any> {
    try {
      this.utilsService.showLoading();
      const calendarDataFromApi = await this.parametrizationService.GetParametrizationProgress(this.CalendarID).toPromise();
      this.CalendarData = calendarDataFromApi.registros;
      this.form.get('nombre').patchValue(this.CalendarData.calendario.vNombre)
      this.form.get('tipoEvaluacion').patchValue(this.CalendarData.calendario.tipo)
      this.utilsService.closeLoading();
    } catch (error) {
      console.error('Error al cargar los datos del calendario:', error);
      return Swal.fire('Error al cargar los datos del calendario', 'Por favor, inténtalo de nuevo más tarde.', 'error');
    }
  }

  handleTipoEvaluacionChange(value: string) {
    if (value === '90') {
      this.evaluadores = [{ tipo: 'Jefe', peso: 100, cantidad: 1 }];
      this.form.get('cantidadSubordinados')!.disable();
      this.utilsService.closeLoading();
    }else if(value === '180') {
      this.evaluadores = [
        { tipo: 'Jefe', peso: 70, cantidad: 1 },
        { tipo: 'Subordinados', peso: 30, cantidad: 3 }
      ]
      this.evaluadores[0].peso =  this.data.registros.porcentajeEvaluadorJefe;
      this.evaluadores[1].peso =  this.data.registros.porcentajeEvaluadoresSubordinados;
      this.evaluadores[1].cantidad =  this.data.registros.cantidadEvaluadoresSubordinados;
      this.form.get('cantidadSubordinados').patchValue( this.data.registros.cantidadEvaluadoresSubordinados);
      this.form.get('cantidadSubordinados')!.enable();
      this.utilsService.closeLoading();
    }else{
      Swal.fire('Tipo de calendario desconocido','El tipo del calendario, es desconocido.','warning').then(() => {
        this.router.navigateByUrl('/home');
      })
    }
  }

  handlePesoChange(index: number, event: any) {
    const value = event.value !== undefined ? event.value : 0;
    this.evaluadores[index].peso = value;
  }

  preventKeyboardInput(event: KeyboardEvent): void {
    if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.form.valid) {
      const FormBody = {...this.evaluadores,...this.form.value,};

  

      let bodyToSend: ICalendarCalcRules = {
        calendario: {
          vCodigo: this.CalendarID
        },
        porcentajeEvaluadorJefe: FormBody[0].peso,
        porcentajeEvaluadoresSubordinados: FormBody[1].peso,
        cantidadEvaluadoresSubordinados: FormBody.cantidadSubordinados
      }

      if(FormBody[0].peso + FormBody[1].peso === 100){
        Swal.fire({
          title:  "Aviso",
          text: `¿Estás seguro de ${!this.CalendarData.reglaCalculo ? 'registrar' : 'actualizar'} la configuración de las reglas de cálculo del calendario?`,
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: `${!this.CalendarData.reglaCalculo ? 'Registrar' : 'Actualizar'}`,
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.value) {
              this.utilsService.showLoading()
              if(!this.CalendarData.reglaCalculo){
                this.calculationRulesService.PostCalendarDataForCalcRules(bodyToSend).subscribe({
                  next: (data) => {
                    Swal.fire("Regla de cálculo registrado","La regla de cálculo se ha registrado correctamente.","success").then(() => {
                      this.router.navigateByUrl(`/home/parametrizar-calendario/${this.CalendarID}`);
                    })
                  },
                  error: (error) => {
                    console.error("Error:", error.message);
                    Swal.fire("Error al registrar calendario",'',"error");
                  }
                }); 
              }else{
                this.calculationRulesService.PutCalendarDataForCalcRules(bodyToSend).subscribe({
                  next: (data) => {
                    Swal.fire("Regla de cálculo actualizado","La regla de cálculo se ha actualizado correctamente.","success").then(() => {
                      this.router.navigateByUrl(`/home/parametrizar-calendario/${this.CalendarID}`);
                    })
                  },
                  error: (error) => {
                    console.error("Error:", error.message);
                    Swal.fire("Error al actualizar calendario",'',"error");
                  }
                }); 
              }
             
          }
        }) 
      }else{
        Swal.fire("Porcentajes inválidos","La suma de los promedios porcentuales del Evaluador jefe y sus Subordinados debe ser exactamente del 100%.","warning")
      }
        
 
      }
     
    }

    CancelButton(){
      return this.router.navigateByUrl(`/home/parametrizar-calendario/${this.CalendarID}`);
    }
  }

