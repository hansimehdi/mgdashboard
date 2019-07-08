import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobOfferInfoComponent } from './job-offer-info.component';

describe('JobOfferInfoComponent', () => {
  let component: JobOfferInfoComponent;
  let fixture: ComponentFixture<JobOfferInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobOfferInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobOfferInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
