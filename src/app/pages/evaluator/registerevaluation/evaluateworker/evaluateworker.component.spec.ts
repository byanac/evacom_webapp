import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluateworkerComponent } from './evaluateworker.component';

describe('EvaluateworkerComponent', () => {
  let component: EvaluateworkerComponent;
  let fixture: ComponentFixture<EvaluateworkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluateworkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluateworkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
