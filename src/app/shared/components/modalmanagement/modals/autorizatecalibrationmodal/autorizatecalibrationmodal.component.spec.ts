import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorizatecalibrationmodalComponent } from './autorizatecalibrationmodal.component';

describe('AutorizatecalibrationmodalComponent', () => {
  let component: AutorizatecalibrationmodalComponent;
  let fixture: ComponentFixture<AutorizatecalibrationmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutorizatecalibrationmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutorizatecalibrationmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
