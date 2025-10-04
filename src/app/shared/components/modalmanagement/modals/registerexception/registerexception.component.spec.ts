import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterexceptionComponent } from './registerexception.component';

describe('RegisterexceptionComponent', () => {
  let component: RegisterexceptionComponent;
  let fixture: ComponentFixture<RegisterexceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterexceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterexceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
