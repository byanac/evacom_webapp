import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteAvanceevaluacionComponent } from './reporte-avanceevaluacion.component';

describe('ReporteAvanceevaluacionComponent', () => {
  let component: ReporteAvanceevaluacionComponent;
  let fixture: ComponentFixture<ReporteAvanceevaluacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteAvanceevaluacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteAvanceevaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
