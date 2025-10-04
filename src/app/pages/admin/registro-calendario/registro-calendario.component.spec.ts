import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCalendarioComponent } from './registro-calendario.component';

describe('RegistroCalendarioComponent', () => {
  let component: RegistroCalendarioComponent;
  let fixture: ComponentFixture<RegistroCalendarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroCalendarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
