import { TestBed, inject } from '@angular/core/testing';

import { InscriptionService } from './inscription.service';

describe('InscriptionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InscriptionService]
    });
  });

  it('should be created', inject([InscriptionService], (service: InscriptionService) => {
    expect(service).toBeTruthy();
  }));
});
