import { TestBed } from '@angular/core/testing';

import { ParametrizationService } from './parametrization.service';

describe('ParametrizationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ParametrizationService = TestBed.get(ParametrizationService);
    expect(service).toBeTruthy();
  });
});
