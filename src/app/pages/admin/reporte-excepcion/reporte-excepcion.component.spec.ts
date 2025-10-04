import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteExcepcionComponent } from './reporte-excepcion.component';

describe('ReporteExcepcionComponent', () => {
  let component: ReporteExcepcionComponent;
  let fixture: ComponentFixture<ReporteExcepcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteExcepcionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteExcepcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
