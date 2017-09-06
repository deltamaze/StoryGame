import { Component, OnInit } from '@angular/core';
import {StoryGameService} from '../story-game.service';


@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {
  
  private status: string = "";
  private chatMessages: any;
  private chatInput: string;
  private playerList: any;
  private gameStory: any;
  private gameInfo: any;

  constructor(private gameService: StoryGameService) { }

  ngOnInit() {
    this.gameService.getErrorStatus().subscribe(status => this.status = status);
    //subscripe to rest chatmessages, playerlist,gamestory,gameinfo
  }

  private submitChatMessage():void
  {
    this.gameService.submitChatMessage(this.chatInput);
    this.chatInput = "";//clear input

  }
  private submitIdea():void
  {
    this.gameService.submitChatMessage(this.chatInput);

  }
  private submiteVote():void
  {
    this.gameService.submiteVote("");

  }
  private leaveGame():void
  {
    this.gameService.navHome(); //this will unsubscripe player from gameroom as well as returning player home

  }


}
