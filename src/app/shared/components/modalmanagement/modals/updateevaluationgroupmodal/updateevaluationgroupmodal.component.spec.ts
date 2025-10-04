import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateevaluationgroupmodalComponent } from './updateevaluationgroupmodal.component';

describe('UpdateevaluationgroupmodalComponent', () => {
  let component: UpdateevaluationgroupmodalComponent;
  let fixture: ComponentFixture<UpdateevaluationgroupmodalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateevaluationgroupmodalComponent]
    });
    fixture = TestBed.createComponent(UpdateevaluationgroupmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
