import { TestBed } from '@angular/core/testing';

import { CalcrulesService } from './calcrules.service';

describe('CalcrulesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalcrulesService = TestBed.get(CalcrulesService);
    expect(service).toBeTruthy();
  });
});
