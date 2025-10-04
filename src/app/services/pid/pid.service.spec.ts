import { TestBed } from '@angular/core/testing';

import { PidService } from './pid.service';

describe('PidService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PidService = TestBed.get(PidService);
    expect(service).toBeTruthy();
  });
});
