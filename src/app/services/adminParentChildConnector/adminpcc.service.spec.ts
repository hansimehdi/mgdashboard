import { TestBed, inject } from '@angular/core/testing';

import { AdminpccService } from './adminpcc.service';

describe('AdminpccService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminpccService]
    });
  });

  it('should be created', inject([AdminpccService], (service: AdminpccService) => {
    expect(service).toBeTruthy();
  }));
});
