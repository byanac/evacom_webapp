import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetscountersComponent } from './targetscounters.component';

describe('TargetscountersComponent', () => {
  let component: TargetscountersComponent;
  let fixture: ComponentFixture<TargetscountersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TargetscountersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetscountersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
