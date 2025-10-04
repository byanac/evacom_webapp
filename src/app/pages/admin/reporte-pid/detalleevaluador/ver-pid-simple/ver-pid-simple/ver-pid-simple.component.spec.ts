import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPidSimpleComponent } from './ver-pid-simple.component';

describe('VerPidSimpleComponent', () => {
  let component: VerPidSimpleComponent;
  let fixture: ComponentFixture<VerPidSimpleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerPidSimpleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPidSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
