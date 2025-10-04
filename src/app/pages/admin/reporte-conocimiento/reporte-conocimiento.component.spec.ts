import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteConocimientoComponent } from './reporte-conocimiento.component';

describe('ReporteConocimientoComponent', () => {
  let component: ReporteConocimientoComponent;
  let fixture: ComponentFixture<ReporteConocimientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReporteConocimientoComponent]
    });
    fixture = TestBed.createComponent(ReporteConocimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
