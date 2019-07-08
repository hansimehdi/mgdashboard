import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificationInfoComponent } from './specification-info.component';

describe('SpecificationInfoComponent', () => {
  let component: SpecificationInfoComponent;
  let fixture: ComponentFixture<SpecificationInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecificationInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecificationInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
