import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseSettingComponent } from './enterprise-setting.component';

describe('EnterpriseSettingComponent', () => {
  let component: EnterpriseSettingComponent;
  let fixture: ComponentFixture<EnterpriseSettingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseSettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
