import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvalconsolidatedreportmodalComponent } from './evalconsolidatedreportmodal.component';

describe('EvalconsolidatedreportmodalComponent', () => {
  let component: EvalconsolidatedreportmodalComponent;
  let fixture: ComponentFixture<EvalconsolidatedreportmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvalconsolidatedreportmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvalconsolidatedreportmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
