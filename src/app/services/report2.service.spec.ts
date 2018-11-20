import { TestBed, inject } from '@angular/core/testing';

import { Report2Service } from './report2.service';

describe('Report2Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Report2Service]
    });
  });

  it('should be created', inject([Report2Service], (service: Report2Service) => {
    expect(service).toBeTruthy();
  }));
});
