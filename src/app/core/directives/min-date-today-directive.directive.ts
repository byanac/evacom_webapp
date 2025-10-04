import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appMinDateToday]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MinDateTodayDirective),
    multi: true
  }]
})
export class MinDateTodayDirective implements ControlValueAccessor {
  private onChange: (val: string | null) => void;
  private onTouched: () => void;
  private value: string | null;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  // Permitir la escritura libre en el input sin validación inmediata
  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    this.value = value;
    this.onChange(value); // Propaga el valor manualmente
  }

  // Validar la fecha al perder el foco
  @HostListener('blur')
  onBlur() {
    this.onTouched();

    // Validar la fecha solo al perder el foco
    const filteredValue = this.filterMinDate(this.value);
    this.updateTextInput(filteredValue, this.value !== filteredValue);
  }

  private updateTextInput(value: string | null, propagateChange: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value || '');
    if (propagateChange) {
      this.onChange(value);
    }
    this.value = value;
    
  }
  private filterMinDate(value: string): string {
    if (!value) return '';  // No aplicar filtro si no hay valor
  
    const today = new Date();
    // Asegurarse de que la hora sea 00:00:00
    today.setHours(0, 0, 0, 0);
  
    const lastYearDate = new Date();
    lastYearDate.setFullYear(today.getFullYear() - 1);
    lastYearDate.setHours(0, 0, 0, 0);  // Asegurarse que también esté en 00:00:00
  
    const formattedLastYear = lastYearDate.toISOString().split('T')[0]; // Año pasado en formato YYYY-MM-DD
    const formattedToday = today.toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
  
    return value < formattedLastYear ? formattedToday : value; // Si es menor que el límite, usar la fecha actual
  }
  
  

  // ControlValueAccessor Interface
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', isDisabled);
  }

  writeValue(value: any): void {
    value = value ? String(value) : '';
    this.updateTextInput(value, false);
  }
}
