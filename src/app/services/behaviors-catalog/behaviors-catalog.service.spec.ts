import { TestBed } from '@angular/core/testing';

import { BehaviorsCatalogService } from './behaviors-catalog.service';

describe('BehaviorsCatalogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BehaviorsCatalogService = TestBed.get(BehaviorsCatalogService);
    expect(service).toBeTruthy();
  });
});
