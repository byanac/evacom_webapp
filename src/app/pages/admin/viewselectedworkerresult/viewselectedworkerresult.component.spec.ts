import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewselectedworkerresultComponent } from './viewselectedworkerresult.component';

describe('ViewselectedworkerresultComponent', () => {
  let component: ViewselectedworkerresultComponent;
  let fixture: ComponentFixture<ViewselectedworkerresultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewselectedworkerresultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewselectedworkerresultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
