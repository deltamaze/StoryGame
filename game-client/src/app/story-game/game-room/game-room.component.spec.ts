import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameRoomComponent } from './game-room.component';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the sub component that shows games players', () => {
    expect(component).toBeFalsy();
  });
  it('should show sub component that is the game chatroom', () => {
    expect(component).toBeFalsy();
  });
  it('should load sub component that shows story thus far ', () => {
    expect(component).toBeFalsy();
  });
});
