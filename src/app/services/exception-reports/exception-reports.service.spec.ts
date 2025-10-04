import { TestBed } from '@angular/core/testing';

import { ExceptionReportsService } from './exception-reports.service';

describe('ExceptionReportsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExceptionReportsService = TestBed.get(ExceptionReportsService);
    expect(service).toBeTruthy();
  });
});
