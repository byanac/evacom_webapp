import { TestBed } from '@angular/core/testing';

import { AsignationevalgroupsService } from './asignationevalgroups.service';

describe('EsignationevalgroupsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AsignationevalgroupsService = TestBed.get(AsignationevalgroupsService);
    expect(service).toBeTruthy();
  });
});
