import { TestBed, inject } from '@angular/core/testing';

import { LogsManagerService } from './logs-manager.service';

describe('LogsManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LogsManagerService]
    });
  });

  it('should be created', inject([LogsManagerService], (service: LogsManagerService) => {
    expect(service).toBeTruthy();
  }));
});
