import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoHechosResaltantesDetalleEvaluadorComponent } from './historico-hechos-resaltantes-detalle-evaluador.component';

describe('HistoricoHechosResaltantesDetalleEvaluadorComponent', () => {
  let component: HistoricoHechosResaltantesDetalleEvaluadorComponent;
  let fixture: ComponentFixture<HistoricoHechosResaltantesDetalleEvaluadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoHechosResaltantesDetalleEvaluadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoHechosResaltantesDetalleEvaluadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
