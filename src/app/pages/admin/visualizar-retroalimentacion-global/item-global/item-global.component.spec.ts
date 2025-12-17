import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemGlobalComponent } from './item-global.component';

describe('ItemGlobalComponent', () => {
  let component: ItemGlobalComponent;
  let fixture: ComponentFixture<ItemGlobalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemGlobalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemGlobalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
