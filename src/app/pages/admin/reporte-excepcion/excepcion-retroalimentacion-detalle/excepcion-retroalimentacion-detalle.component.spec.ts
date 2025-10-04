import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcepcionRetroalimentacionDetalleComponent } from './excepcion-retroalimentacion-detalle.component';

describe('ExcepcionRetroalimentacionDetalleComponent', () => {
  let component: ExcepcionRetroalimentacionDetalleComponent;
  let fixture: ComponentFixture<ExcepcionRetroalimentacionDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExcepcionRetroalimentacionDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcepcionRetroalimentacionDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
