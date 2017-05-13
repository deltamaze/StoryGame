import { NgModule }            from '@angular/core';

import { SharedModule }        from '../shared/shared.module';
//import { LogonComponent } from './pages/logon/logon.component';


import { StoryGameRoutingModule }   from './story-game-routing.module';
import { HomeComponent } from './home/home.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { FindGameComponent } from './find-game/find-game.component';
import { CreateGameComponent } from './create-game/create-game.component';
import {StoryGameService} from './story-game.service'

@NgModule({
  imports: [ SharedModule , 
    StoryGameRoutingModule],
    
  declarations: [
  HomeComponent,
  GameRoomComponent,
  FindGameComponent,
  CreateGameComponent],
  providers:    [ StoryGameService ]
})
export class StoryGameModule { }
