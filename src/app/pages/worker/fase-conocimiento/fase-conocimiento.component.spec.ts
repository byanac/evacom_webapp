import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaseConocimientoComponent } from './fase-conocimiento.component';

describe('FaseConocimientoComponent', () => {
  let component: FaseConocimientoComponent;
  let fixture: ComponentFixture<FaseConocimientoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaseConocimientoComponent]
    });
    fixture = TestBed.createComponent(FaseConocimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
