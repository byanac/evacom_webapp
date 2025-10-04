import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleevaluadorComponent } from './detalleevaluador.component';

describe('DetalleevaluadorComponent', () => {
  let component: DetalleevaluadorComponent;
  let fixture: ComponentFixture<DetalleevaluadorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleevaluadorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleevaluadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
