import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroGruposEvaluacionComponent } from './registro-grupos-evaluacion.component';

describe('RegistroGruposEvaluacionComponent', () => {
  let component: RegistroGruposEvaluacionComponent;
  let fixture: ComponentFixture<RegistroGruposEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroGruposEvaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroGruposEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
