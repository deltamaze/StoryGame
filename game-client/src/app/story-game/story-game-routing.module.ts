import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { HomeComponent } from './home/home.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { FindGameComponent } from './find-game/find-game.component';
import { CreateGameComponent } from './create-game/create-game.component';
//import { LogonComponent } from './pages/logon/logon.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'home', component: HomeComponent },
    { path: 'gameroom', component: GameRoomComponent },
    { path: 'findgame', component: FindGameComponent },
    { path: 'creategame', component: CreateGameComponent }
  ])],
  exports: [RouterModule]
})
export class StoryGameRoutingModule {}

