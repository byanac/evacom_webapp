import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisteradministratormodalComponent } from './registeradministratormodal.component';

describe('RegisteradministratormodalComponent', () => {
  let component: RegisteradministratormodalComponent;
  let fixture: ComponentFixture<RegisteradministratormodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisteradministratormodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteradministratormodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
