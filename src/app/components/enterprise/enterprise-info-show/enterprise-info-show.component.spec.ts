import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseInfoShowComponent } from './enterprise-info-show.component';

describe('EnterpriseInfoShowComponent', () => {
  let component: EnterpriseInfoShowComponent;
  let fixture: ComponentFixture<EnterpriseInfoShowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseInfoShowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseInfoShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
