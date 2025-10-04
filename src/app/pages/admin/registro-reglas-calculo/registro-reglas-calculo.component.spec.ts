import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroReglasCalculoComponent } from './registro-reglas-calculo.component';

describe('RegistroReglasCalculoComponent', () => {
  let component: RegistroReglasCalculoComponent;
  let fixture: ComponentFixture<RegistroReglasCalculoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroReglasCalculoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroReglasCalculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
