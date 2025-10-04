import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroCatalogoCompetenciasComponent } from './registro-catalogo-competencias.component';

describe('RegistroCatalogoCompetenciasComponent', () => {
  let component: RegistroCatalogoCompetenciasComponent;
  let fixture: ComponentFixture<RegistroCatalogoCompetenciasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroCatalogoCompetenciasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroCatalogoCompetenciasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
