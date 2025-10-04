import { TestBed } from '@angular/core/testing';

import { EvalasignationService } from './evalasignation.service';

describe('EvalasignationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EvalasignationService = TestBed.get(EvalasignationService);
    expect(service).toBeTruthy();
  });
});
