import { TestBed, inject } from '@angular/core/testing';

import { OfferManagerService } from './offer-manager.service';

describe('OfferManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfferManagerService]
    });
  });

  it('should be created', inject([OfferManagerService], (service: OfferManagerService) => {
    expect(service).toBeTruthy();
  }));
});
