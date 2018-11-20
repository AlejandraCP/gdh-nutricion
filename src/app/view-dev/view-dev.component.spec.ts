import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewDevComponent } from './view-dev.component';

describe('ViewDevComponent', () => {
  let component: ViewDevComponent;
  let fixture: ComponentFixture<ViewDevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewDevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
