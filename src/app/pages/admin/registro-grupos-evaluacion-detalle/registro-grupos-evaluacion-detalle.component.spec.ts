import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGruposEvaluacionDetalleComponent } from './registro-grupos-evaluacion-detalle.component';

describe('RegistroGruposEvaluacionDetalleComponent', () => {
  let component: RegistroGruposEvaluacionDetalleComponent;
  let fixture: ComponentFixture<RegistroGruposEvaluacionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroGruposEvaluacionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroGruposEvaluacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
