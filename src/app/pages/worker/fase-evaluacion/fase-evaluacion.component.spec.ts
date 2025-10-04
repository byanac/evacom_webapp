import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaseEvaluacionComponent } from './fase-evaluacion.component';

describe('FaseEvaluacionComponent', () => {
  let component: FaseEvaluacionComponent;
  let fixture: ComponentFixture<FaseEvaluacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaseEvaluacionComponent]
    });
    fixture = TestBed.createComponent(FaseEvaluacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
