import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidEvaluatorcompliancetableComponent } from './pid-evaluatorcompliancetable.component';

describe('PidEvaluatorcompliancetableComponent', () => {
  let component: PidEvaluatorcompliancetableComponent;
  let fixture: ComponentFixture<PidEvaluatorcompliancetableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidEvaluatorcompliancetableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidEvaluatorcompliancetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
