import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogonComponent } from './logon.component';

describe('LogonComponent', () => {
  let component: LogonComponent;
  let fixture: ComponentFixture<LogonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should let user log in with google', () => {
    expect(component).toBeFalsy();
  });

  it('should let user log in with email', () => {
    expect(component).toBeFalsy();
  });

  it('should let user log in as guest', () => {
    expect(component).toBeFalsy();
  });

});
