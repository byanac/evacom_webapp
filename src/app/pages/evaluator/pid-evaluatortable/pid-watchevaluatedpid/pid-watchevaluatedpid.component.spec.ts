import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidWatchevaluatedpidComponent } from './pid-watchevaluatedpid.component';

describe('PidWatchevaluatedpidComponent', () => {
  let component: PidWatchevaluatedpidComponent;
  let fixture: ComponentFixture<PidWatchevaluatedpidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidWatchevaluatedpidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidWatchevaluatedpidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
