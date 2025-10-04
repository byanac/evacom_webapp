import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcepcionEvaluacionDetalleComponent } from './excepcion-evaluacion-detalle.component';

describe('ExcepcionEvaluacionDetalleComponent', () => {
  let component: ExcepcionEvaluacionDetalleComponent;
  let fixture: ComponentFixture<ExcepcionEvaluacionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcepcionEvaluacionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcepcionEvaluacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
