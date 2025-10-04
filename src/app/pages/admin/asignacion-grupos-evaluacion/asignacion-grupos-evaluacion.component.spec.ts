import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignacionGruposEvaluacionComponent } from './asignacion-grupos-evaluacion.component';

describe('AsignacionGruposEvaluacionComponent', () => {
  let component: AsignacionGruposEvaluacionComponent;
  let fixture: ComponentFixture<AsignacionGruposEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignacionGruposEvaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignacionGruposEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
