import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteCalibracionComponent } from './reporte-calibracion.component';

describe('ReporteCalibracionComponent', () => {
  let component: ReporteCalibracionComponent;
  let fixture: ComponentFixture<ReporteCalibracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReporteCalibracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteCalibracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
