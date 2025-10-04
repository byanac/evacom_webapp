import { TestBed } from '@angular/core/testing';

import { FilepositionperiodfilterService } from './filepositionperiodfilter.service';

describe('FilepositionperiodfilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FilepositionperiodfilterService = TestBed.get(FilepositionperiodfilterService);
    expect(service).toBeTruthy();
  });
});
