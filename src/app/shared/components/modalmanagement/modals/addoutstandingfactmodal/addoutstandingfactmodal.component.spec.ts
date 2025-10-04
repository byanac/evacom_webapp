import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddoutstandingfactmodalComponent } from './addoutstandingfactmodal.component';

describe('AddoutstandingfactmodalComponent', () => {
  let component: AddoutstandingfactmodalComponent;
  let fixture: ComponentFixture<AddoutstandingfactmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddoutstandingfactmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddoutstandingfactmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
