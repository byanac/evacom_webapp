import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerencyteamsmultiselectComponent } from './gerencyteamsmultiselect.component';

describe('GerencyteamsmultiselectComponent', () => {
  let component: GerencyteamsmultiselectComponent;
  let fixture: ComponentFixture<GerencyteamsmultiselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GerencyteamsmultiselectComponent]
    });
    fixture = TestBed.createComponent(GerencyteamsmultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
