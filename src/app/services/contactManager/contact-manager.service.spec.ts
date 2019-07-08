import { TestBed, inject } from '@angular/core/testing';

import { ContactManagerService } from './contact-manager.service';

describe('ContactManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactManagerService]
    });
  });

  it('should be created', inject([ContactManagerService], (service: ContactManagerService) => {
    expect(service).toBeTruthy();
  }));
});
