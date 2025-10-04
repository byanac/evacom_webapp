import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidEvaluatortableComponent } from './pid-evaluatortable.component';

describe('PidEvaluatortableComponent', () => {
  let component: PidEvaluatortableComponent;
  let fixture: ComponentFixture<PidEvaluatortableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidEvaluatortableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidEvaluatortableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
