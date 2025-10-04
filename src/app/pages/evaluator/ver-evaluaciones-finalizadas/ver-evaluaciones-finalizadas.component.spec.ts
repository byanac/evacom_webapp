import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerEvaluacionesFinalizadasComponent } from './ver-evaluaciones-finalizadas.component';

describe('VerEvaluacionesFinalizadasComponent', () => {
  let component: VerEvaluacionesFinalizadasComponent;
  let fixture: ComponentFixture<VerEvaluacionesFinalizadasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerEvaluacionesFinalizadasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerEvaluacionesFinalizadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
