import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEvaluadores90Component } from './registro-evaluadores90.component';

describe('RegistroEvaluadores90Component', () => {
  let component: RegistroEvaluadores90Component;
  let fixture: ComponentFixture<RegistroEvaluadores90Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroEvaluadores90Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroEvaluadores90Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
