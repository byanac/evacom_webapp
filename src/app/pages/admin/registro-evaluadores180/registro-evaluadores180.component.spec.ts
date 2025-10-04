import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroEvaluadores180Component } from './registro-evaluadores180.component';

describe('RegistroEvaluadores180Component', () => {
  let component: RegistroEvaluadores180Component;
  let fixture: ComponentFixture<RegistroEvaluadores180Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroEvaluadores180Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroEvaluadores180Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
