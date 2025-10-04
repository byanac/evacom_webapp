import { TestBed } from '@angular/core/testing';

import { EvaluatorsService } from './evaluators.service';

describe('EvaluatorsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvaluatorsService = TestBed.get(EvaluatorsService);
    expect(service).toBeTruthy();
  });
});
