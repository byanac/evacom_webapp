import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComparativecalibrationsmodalComponent } from './comparativecalibrationsmodal.component';

describe('ComparativecalibrationsmodalComponent', () => {
  let component: ComparativecalibrationsmodalComponent;
  let fixture: ComponentFixture<ComparativecalibrationsmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComparativecalibrationsmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComparativecalibrationsmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
