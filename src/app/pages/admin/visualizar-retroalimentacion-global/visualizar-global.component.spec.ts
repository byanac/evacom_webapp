import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarGlobalComponent } from './visualizar-global.component';

describe('VisualizarGlobalComponent', () => {
  let component: VisualizarGlobalComponent;
  let fixture: ComponentFixture<VisualizarGlobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizarGlobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizarGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
