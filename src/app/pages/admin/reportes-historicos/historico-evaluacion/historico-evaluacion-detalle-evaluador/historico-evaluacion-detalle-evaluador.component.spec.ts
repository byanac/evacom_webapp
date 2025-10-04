import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoEvaluacionDetalleEvaluadorComponent } from './historico-evaluacion-detalle-evaluador.component';

describe('HistoricoEvaluacionDetalleEvaluadorComponent', () => {
  let component: HistoricoEvaluacionDetalleEvaluadorComponent;
  let fixture: ComponentFixture<HistoricoEvaluacionDetalleEvaluadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoEvaluacionDetalleEvaluadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoEvaluacionDetalleEvaluadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
