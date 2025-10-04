import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PidWatchevaluatedcompliancepidComponent } from './pid-watchevaluatedcompliancepid.component';

describe('PidWatchevaluatedcompliancepidComponent', () => {
  let component: PidWatchevaluatedcompliancepidComponent;
  let fixture: ComponentFixture<PidWatchevaluatedcompliancepidComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PidWatchevaluatedcompliancepidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PidWatchevaluatedcompliancepidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
