import { TestBed } from '@angular/core/testing';

import { AddoutstandingfactmodalService } from './addoutstandingfactmodal.service';

describe('AddoutstandingfactmodalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddoutstandingfactmodalService = TestBed.get(AddoutstandingfactmodalService);
    expect(service).toBeTruthy();
  });
});
