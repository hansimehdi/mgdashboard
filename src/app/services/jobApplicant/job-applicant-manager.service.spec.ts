import { TestBed, inject } from '@angular/core/testing';

import { JobApplicantManagerService } from './job-applicant-manager.service';

describe('JobApplicantManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JobApplicantManagerService]
    });
  });

  it('should be created', inject([JobApplicantManagerService], (service: JobApplicantManagerService) => {
    expect(service).toBeTruthy();
  }));
});
