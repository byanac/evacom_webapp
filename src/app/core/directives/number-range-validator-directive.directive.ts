import { Directive, ElementRef, forwardRef, HostListener, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appNumberRangeValidator]',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NumberRangeValidatorDirective),
    multi: true
  }]
})
export class NumberRangeValidatorDirective implements ControlValueAccessor {
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

  // Validar el número al perder el foco
  @HostListener('blur')
  onBlur() {
    this.onTouched();

    // Validar el número solo al perder el foco
    const filteredValue = this.filterNumberRange(this.value);
    this.updateTextInput(filteredValue, this.value !== filteredValue);
  }

  private updateTextInput(value: string | null, propagateChange: boolean) {
    this.renderer.setProperty(this.elementRef.nativeElement, 'value', value || '');
    if (propagateChange) {
      this.onChange(value);
    }
    this.value = value;
  }

  private filterNumberRange(value: string): string {
    if (!value) return ''; // No aplicar filtro si no hay valor

    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return ''; // Si no es un número, limpiar el campo
    if (numValue <= 0) return '1'; // Valor mínimo permitido
    if (numValue > 100) return '100'; // Valor máximo permitido

    return value;
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
