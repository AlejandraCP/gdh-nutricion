import { TestBed, inject } from '@angular/core/testing';

import { TurnsStateService } from './turns-state.service';

describe('TurnsStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TurnsStateService]
    });
  });

  it('should be created', inject([TurnsStateService], (service: TurnsStateService) => {
    expect(service).toBeTruthy();
  }));
});
