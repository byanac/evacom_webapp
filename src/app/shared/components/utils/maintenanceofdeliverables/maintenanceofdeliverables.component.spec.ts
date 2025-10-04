import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceofdeliverablesComponent } from './maintenanceofdeliverables.component';

describe('MaintenanceofdeliverablesComponent', () => {
  let component: MaintenanceofdeliverablesComponent;
  let fixture: ComponentFixture<MaintenanceofdeliverablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaintenanceofdeliverablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceofdeliverablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
