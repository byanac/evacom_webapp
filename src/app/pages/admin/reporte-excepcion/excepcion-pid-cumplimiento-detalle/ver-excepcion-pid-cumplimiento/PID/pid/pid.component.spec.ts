import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PIDComponent } from './pid.component';

describe('PIDComponent', () => {
  let component: PIDComponent;
  let fixture: ComponentFixture<PIDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PIDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PIDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
