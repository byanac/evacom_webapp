import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParametrizarCalendarioComponent } from './parametrizar-calendario.component';

describe('ParametrizarCalendarioComponent', () => {
  let component: ParametrizarCalendarioComponent;
  let fixture: ComponentFixture<ParametrizarCalendarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrizarCalendarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrizarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
