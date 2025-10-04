import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUMPLIMIENTOComponent } from './cumplimiento.component';

describe('CUMPLIMIENTOComponent', () => {
  let component: CUMPLIMIENTOComponent;
  let fixture: ComponentFixture<CUMPLIMIENTOComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CUMPLIMIENTOComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CUMPLIMIENTOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
