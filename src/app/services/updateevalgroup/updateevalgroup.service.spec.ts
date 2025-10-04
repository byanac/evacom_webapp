import { TestBed } from '@angular/core/testing';

import { UpdateevalgroupService } from './updateevalgroup.service';

describe('UpdateevalgroupService', () => {
  let service: UpdateevalgroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.get(UpdateevalgroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
