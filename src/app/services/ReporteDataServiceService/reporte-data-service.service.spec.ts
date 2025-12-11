import { TestBed } from '@angular/core/testing';

import { ReporteDataServiceService } from './reporte-data-service.service';

describe('ReporteDataServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ReporteDataServiceService = TestBed.get(ReporteDataServiceService);
    expect(service).toBeTruthy();
  });
});
