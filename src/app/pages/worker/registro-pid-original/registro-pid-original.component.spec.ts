import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroPidOriginalComponent } from './registro-pid-original.component';

describe('RegistroPidOriginalComponent', () => {
  let component: RegistroPidOriginalComponent;
  let fixture: ComponentFixture<RegistroPidOriginalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroPidOriginalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroPidOriginalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
