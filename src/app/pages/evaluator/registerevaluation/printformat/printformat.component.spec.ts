import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintformatComponent } from './printformat.component';

describe('PrintformatComponent', () => {
  let component: PrintformatComponent;
  let fixture: ComponentFixture<PrintformatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintformatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
