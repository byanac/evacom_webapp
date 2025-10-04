import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterEvaluatedFeedbackComponent } from './register-evaluated-feedback.component';

describe('RegisterEvaluatedFeedbackComponent', () => {
  let component: RegisterEvaluatedFeedbackComponent;
  let fixture: ComponentFixture<RegisterEvaluatedFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterEvaluatedFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterEvaluatedFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
