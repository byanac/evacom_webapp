import { TestBed } from '@angular/core/testing';

import { GerencyteamsmultiselectService } from './gerencyteamsmultiselect.service';

describe('GerencyteamsmultiselectService', () => {
  let service: GerencyteamsmultiselectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GerencyteamsmultiselectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
