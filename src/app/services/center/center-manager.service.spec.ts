import { TestBed, inject } from '@angular/core/testing';

import { CenterManagerService } from './center-manager.service';

describe('CenterManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CenterManagerService]
    });
  });

  it('should be created', inject([CenterManagerService], (service: CenterManagerService) => {
    expect(service).toBeTruthy();
  }));
});
