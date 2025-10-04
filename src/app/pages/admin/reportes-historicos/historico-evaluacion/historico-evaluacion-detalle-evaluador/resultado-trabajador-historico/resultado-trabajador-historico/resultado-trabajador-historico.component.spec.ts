import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultadoTrabajadorHistoricoComponent } from './resultado-trabajador-historico.component';

describe('ResultadoTrabajadorHistoricoComponent', () => {
  let component: ResultadoTrabajadorHistoricoComponent;
  let fixture: ComponentFixture<ResultadoTrabajadorHistoricoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultadoTrabajadorHistoricoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadoTrabajadorHistoricoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
