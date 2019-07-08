import { TestBed, inject } from '@angular/core/testing';

import { EnterpriseManagerService } from './enterprise-manager.service';

describe('EnterpriseManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EnterpriseManagerService]
    });
  });

  it('should be created', inject([EnterpriseManagerService], (service: EnterpriseManagerService) => {
    expect(service).toBeTruthy();
  }));
});
