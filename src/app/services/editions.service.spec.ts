import { TestBed, inject } from '@angular/core/testing';

import { EditionsService } from './editions.service';

describe('EditionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EditionsService]
    });
  });

  it('should be created', inject([EditionsService], (service: EditionsService) => {
    expect(service).toBeTruthy();
  }));
});
