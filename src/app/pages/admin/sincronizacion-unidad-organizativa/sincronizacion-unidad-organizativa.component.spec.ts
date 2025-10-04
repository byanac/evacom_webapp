import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidMantenimientoEntregablesIndicadoresComponent } from './pid-mantenimiento-entregables-indicadores.component';

describe('PidMantenimientoEntregablesIndicadoresComponent', () => {
  let component: PidMantenimientoEntregablesIndicadoresComponent;
  let fixture: ComponentFixture<PidMantenimientoEntregablesIndicadoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidMantenimientoEntregablesIndicadoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidMantenimientoEntregablesIndicadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
