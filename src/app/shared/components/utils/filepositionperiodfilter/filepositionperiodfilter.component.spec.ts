import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilepositionperiodfilterComponent } from './filepositionperiodfilter.component';

describe('FilepositionperiodfilterComponent', () => {
  let component: FilepositionperiodfilterComponent;
  let fixture: ComponentFixture<FilepositionperiodfilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilepositionperiodfilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilepositionperiodfilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
