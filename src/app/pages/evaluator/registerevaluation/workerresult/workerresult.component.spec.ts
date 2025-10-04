import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerresultComponent } from './workerresult.component';

describe('WorkerresultComponent', () => {
  let component: WorkerresultComponent;
  let fixture: ComponentFixture<WorkerresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
