import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCumplimientoPidComponent } from './registro-cumplimiento-pid.component';

describe('RegistroCumplimientoPidComponent', () => {
  let component: RegistroCumplimientoPidComponent;
  let fixture: ComponentFixture<RegistroCumplimientoPidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroCumplimientoPidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCumplimientoPidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
