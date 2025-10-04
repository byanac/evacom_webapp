import { TestBed } from '@angular/core/testing';

import { AutoevaluationService } from './autoevaluation.service';

describe('AutoevaluationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AutoevaluationService = TestBed.get(AutoevaluationService);
    expect(service).toBeTruthy();
  });
});
