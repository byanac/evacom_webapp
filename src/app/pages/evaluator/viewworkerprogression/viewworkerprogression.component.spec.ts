import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewworkerprogressionComponent } from './viewworkerprogression.component';

describe('ViewworkerprogressionComponent', () => {
  let component: ViewworkerprogressionComponent;
  let fixture: ComponentFixture<ViewworkerprogressionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewworkerprogressionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewworkerprogressionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
