import { TestBed } from '@angular/core/testing';

import { GerencyService } from './gerency.service';

describe('GerencyService', () => {
  let service: GerencyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(GerencyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
