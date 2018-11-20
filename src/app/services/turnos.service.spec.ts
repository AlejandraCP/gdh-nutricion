import { TestBed, inject } from '@angular/core/testing';

import { TurnosService } from './turnos.service';

describe('TurnosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnosService]
    });
  });

  it('should be created', inject([TurnosService], (service: TurnosService) => {
    expect(service).toBeTruthy();
  }));
});
