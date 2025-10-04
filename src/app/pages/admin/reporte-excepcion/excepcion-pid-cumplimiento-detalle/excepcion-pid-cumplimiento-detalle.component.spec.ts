import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcepcionPidCumplimientoDetalleComponent } from './excepcion-pid-cumplimiento-detalle.component';

describe('ExcepcionPidCumplimientoDetalleComponent', () => {
  let component: ExcepcionPidCumplimientoDetalleComponent;
  let fixture: ComponentFixture<ExcepcionPidCumplimientoDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcepcionPidCumplimientoDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcepcionPidCumplimientoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
