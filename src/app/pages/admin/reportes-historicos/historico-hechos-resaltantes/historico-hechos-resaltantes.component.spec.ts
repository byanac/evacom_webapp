import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoHechosResaltantesComponent } from './historico-hechos-resaltantes.component';

describe('HistoricoHechosResaltantesComponent', () => {
  let component: HistoricoHechosResaltantesComponent;
  let fixture: ComponentFixture<HistoricoHechosResaltantesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoHechosResaltantesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoHechosResaltantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
