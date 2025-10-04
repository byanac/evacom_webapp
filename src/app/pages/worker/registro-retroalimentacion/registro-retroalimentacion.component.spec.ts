import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroRetroalimentacionComponent } from './registro-retroalimentacion.component';

describe('RegistroRetroalimentacionComponent', () => {
  let component: RegistroRetroalimentacionComponent;
  let fixture: ComponentFixture<RegistroRetroalimentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroRetroalimentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroRetroalimentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
