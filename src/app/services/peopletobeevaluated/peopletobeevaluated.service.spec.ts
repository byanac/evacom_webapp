import { TestBed } from '@angular/core/testing';

import { PeopletobeevaluatedService } from './peopletobeevaluated.service';

describe('PeopletobeevaluatedService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PeopletobeevaluatedService = TestBed.get(PeopletobeevaluatedService);
    expect(service).toBeTruthy();
  });
});
