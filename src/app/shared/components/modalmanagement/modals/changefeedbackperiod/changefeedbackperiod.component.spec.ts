import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangefeedbackperiodComponent } from './changefeedbackperiod.component';

describe('ChangefeedbackperiodComponent', () => {
  let component: ChangefeedbackperiodComponent;
  let fixture: ComponentFixture<ChangefeedbackperiodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangefeedbackperiodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangefeedbackperiodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
