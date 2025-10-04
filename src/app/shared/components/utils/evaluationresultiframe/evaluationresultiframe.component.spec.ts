import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationResultiframeComponent } from './evaluationresultiframe.component';

describe('EvaluationiframeComponent', () => {
  let component: EvaluationResultiframeComponent;
  let fixture: ComponentFixture<EvaluationResultiframeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationResultiframeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationResultiframeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
