import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPidCumplimientoComponent } from './ver-pid-cumplimiento.component';

describe('VerPidCumplimientoComponent', () => {
  let component: VerPidCumplimientoComponent;
  let fixture: ComponentFixture<VerPidCumplimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerPidCumplimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPidCumplimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
