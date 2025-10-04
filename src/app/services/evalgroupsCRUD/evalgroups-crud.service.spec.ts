import { TestBed } from '@angular/core/testing';

import { EvalgroupsCRUDService } from './evalgroups-crud.service';

describe('EvalgroupsCRUDService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvalgroupsCRUDService = TestBed.get(EvalgroupsCRUDService);
    expect(service).toBeTruthy();
  });
});
