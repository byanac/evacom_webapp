import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprimirFormatopreevalComponent } from './imprimir-formatopreeval.component';

describe('ImprimirFormatopreevalComponent', () => {
  let component: ImprimirFormatopreevalComponent;
  let fixture: ComponentFixture<ImprimirFormatopreevalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImprimirFormatopreevalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImprimirFormatopreevalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
