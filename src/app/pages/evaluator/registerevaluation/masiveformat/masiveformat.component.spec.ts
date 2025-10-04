import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasiveformatComponent } from './masiveformat.component';

describe('MasiveformatComponent', () => {
  let component: MasiveformatComponent;
  let fixture: ComponentFixture<MasiveformatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasiveformatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasiveformatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
