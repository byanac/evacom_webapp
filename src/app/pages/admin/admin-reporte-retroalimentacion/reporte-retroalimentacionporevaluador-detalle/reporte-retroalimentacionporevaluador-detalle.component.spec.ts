import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRetroalimentacionporevaluadorDetalleComponent } from './reporte-retroalimentacionporevaluador-detalle.component';

describe('ReporteRetroalimentacionporevaluadorDetalleComponent', () => {
  let component: ReporteRetroalimentacionporevaluadorDetalleComponent;
  let fixture: ComponentFixture<ReporteRetroalimentacionporevaluadorDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteRetroalimentacionporevaluadorDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteRetroalimentacionporevaluadorDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
