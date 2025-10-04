import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoCalibracionComponent } from './historico-calibracion.component';

describe('HistoricoCalibracionComponent', () => {
  let component: HistoricoCalibracionComponent;
  let fixture: ComponentFixture<HistoricoCalibracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoCalibracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoCalibracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
