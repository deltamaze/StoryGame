import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { HttpModule } from '@angular/http';

import { StoryGameRoutingModule } from './story-game-routing.module';
import { HomeComponent } from './home/home.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { JoinGameComponent } from './join-game/join-game.component';
import { CreateGameComponent } from './create-game/create-game.component';
import {StoryGameService} from './story-game.service';

@NgModule({
  imports: [ SharedModule ,
    StoryGameRoutingModule,
    HttpModule],
  declarations: [
  HomeComponent,
  GameRoomComponent,
  JoinGameComponent,
  CreateGameComponent],
  providers: [ StoryGameService ]
})
export class StoryGameModule { }
