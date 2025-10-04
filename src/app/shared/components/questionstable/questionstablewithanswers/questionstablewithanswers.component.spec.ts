import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionstablewithanswersComponent } from './questionstablewithanswers.component';

describe('QuestionstablewithanswersComponent', () => {
  let component: QuestionstablewithanswersComponent;
  let fixture: ComponentFixture<QuestionstablewithanswersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuestionstablewithanswersComponent]
    });
    fixture = TestBed.createComponent(QuestionstablewithanswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
