import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerExcepcionResultadoRetroalimentacionComponent } from './ver-excepcion-resultado-retroalimentacion.component';

describe('VerExcepcionResultadoRetroalimentacionComponent', () => {
  let component: VerExcepcionResultadoRetroalimentacionComponent;
  let fixture: ComponentFixture<VerExcepcionResultadoRetroalimentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerExcepcionResultadoRetroalimentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerExcepcionResultadoRetroalimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
