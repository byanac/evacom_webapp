import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePidComponent } from './reporte-pid.component';

describe('ReportePidComponent', () => {
  let component: ReportePidComponent;
  let fixture: ComponentFixture<ReportePidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportePidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
