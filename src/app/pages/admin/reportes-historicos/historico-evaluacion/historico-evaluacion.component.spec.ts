import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoEvaluacionComponent } from './historico-evaluacion.component';

describe('HistoricoEvaluacionComponent', () => {
  let component: HistoricoEvaluacionComponent;
  let fixture: ComponentFixture<HistoricoEvaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoEvaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
