import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCalendarioComponent } from './editar-calendario.component';

describe('EditarCalendarioComponent', () => {
  let component: EditarCalendarioComponent;
  let fixture: ComponentFixture<EditarCalendarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarCalendarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarCalendarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
