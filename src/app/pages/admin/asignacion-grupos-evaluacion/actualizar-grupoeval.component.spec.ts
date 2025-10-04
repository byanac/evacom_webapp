import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarGrupoevalComponent } from './actualizar-grupoeval.component';

describe('ActualizarGrupoevalComponent', () => {
  let component: ActualizarGrupoevalComponent;
  let fixture: ComponentFixture<ActualizarGrupoevalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActualizarGrupoevalComponent]
    });
    fixture = TestBed.createComponent(ActualizarGrupoevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
