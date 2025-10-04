import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarRetroalimentacionComponent } from './visualizar-retroalimentacion.component';

describe('VisualizarRetroalimentacionComponent', () => {
  let component: VisualizarRetroalimentacionComponent;
  let fixture: ComponentFixture<VisualizarRetroalimentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarRetroalimentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarRetroalimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
