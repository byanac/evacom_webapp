import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalmanagementComponent } from './modalmanagement.component';

describe('ModalmanagementComponent', () => {
  let component: ModalmanagementComponent;
  let fixture: ComponentFixture<ModalmanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalmanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalmanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
