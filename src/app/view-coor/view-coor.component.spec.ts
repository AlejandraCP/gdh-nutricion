import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCoorComponent } from './view-coor.component';

describe('ViewCoorComponent', () => {
  let component: ViewCoorComponent;
  let fixture: ComponentFixture<ViewCoorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCoorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
