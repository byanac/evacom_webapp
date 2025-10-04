import { TestBed } from '@angular/core/testing';

import { EvalgroupsService } from './evalgroups.service';

describe('EvalgroupsService', () => {
  let service: EvalgroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(EvalgroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
