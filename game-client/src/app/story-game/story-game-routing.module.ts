import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { CreateGameComponent } from './create-game/create-game.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'home', component: HomeComponent },
    { path: 'gameroom', component: GameRoomComponent },
    { path: 'joinGame', component: JoinGameComponent },
    { path: 'createGame', component: CreateGameComponent }
  ])],
  exports: [RouterModule]
})
export class StoryGameRoutingModule {}

