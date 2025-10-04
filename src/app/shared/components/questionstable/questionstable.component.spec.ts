import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionstableComponent } from './questionstable.component';

describe('QuestionstableComponent', () => {
  let component: QuestionstableComponent;
  let fixture: ComponentFixture<QuestionstableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionstableComponent]
    });
    fixture = TestBed.createComponent(QuestionstableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
