import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerExcepcionResultadoEvaluacionComponent } from './ver-excepcion-resultado-evaluacion.component';

describe('VerExcepcionResultadoEvaluacionComponent', () => {
  let component: VerExcepcionResultadoEvaluacionComponent;
  let fixture: ComponentFixture<VerExcepcionResultadoEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerExcepcionResultadoEvaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerExcepcionResultadoEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
