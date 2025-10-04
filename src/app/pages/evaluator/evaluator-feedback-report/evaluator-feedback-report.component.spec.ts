import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatorFeedbackReportComponent } from './evaluator-feedback-report.component';

describe('EvaluatorFeedbackReportComponent', () => {
  let component: EvaluatorFeedbackReportComponent;
  let fixture: ComponentFixture<EvaluatorFeedbackReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluatorFeedbackReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluatorFeedbackReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
