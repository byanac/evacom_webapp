import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesEvaluadorComponent } from './detalles-evaluador.component';

describe('DetallesEvaluadorComponent', () => {
  let component: DetallesEvaluadorComponent;
  let fixture: ComponentFixture<DetallesEvaluadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesEvaluadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesEvaluadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
