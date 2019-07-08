import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSpecsComponent } from './list-specs.component';

describe('ListSpecsComponent', () => {
  let component: ListSpecsComponent;
  let fixture: ComponentFixture<ListSpecsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSpecsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSpecsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
