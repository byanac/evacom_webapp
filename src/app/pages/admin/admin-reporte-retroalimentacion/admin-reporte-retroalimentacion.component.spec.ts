import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReporteRetroalimentacionComponent } from './admin-reporte-retroalimentacion.component';

describe('AdminReporteRetroalimentacionComponent', () => {
  let component: AdminReporteRetroalimentacionComponent;
  let fixture: ComponentFixture<AdminReporteRetroalimentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminReporteRetroalimentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminReporteRetroalimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
