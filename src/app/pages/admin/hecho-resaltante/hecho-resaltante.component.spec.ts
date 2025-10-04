import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HechoResaltanteComponent } from './hecho-resaltante.component';

describe('HechoResaltanteComponent', () => {
  let component: HechoResaltanteComponent;
  let fixture: ComponentFixture<HechoResaltanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HechoResaltanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HechoResaltanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
