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
  private ideaInput: string;

  constructor(private gameService: StoryGameService) { }

  ngOnInit() {
    //make sure player is in game, and didn't nav straight here without joinin a game
    this.gameService.verifyInGameStatus();

    this.gameService.getErrorStatus().subscribe(status => this.status = status);
    this.gameService.getGameInfo().subscribe(res => this.gameInfo = res);
    this.gameService.getChatMessages().subscribe(res => {
      this.chatMessages = res;
    });
    this.gameService.getPlayerList().subscribe(res => {
      this.playerList = res;
    });
  }

  private submitChatMessage():void
  {
    this.gameService.submitChatMessage(this.chatInput);
    this.chatInput = "";//clear input
    this.gameService.clearError();

  }
  private startGame(): void
  {
    this.gameService.startGame();
  }
  private submitIdea():void
  {
    this.gameService.submitInput(this.ideaInput,this.gameInfo.currentRound);
  }
  private submiteVote():void
  {
    this.gameService.submitInput("",this.gameInfo.currentRound);
  }
  private leaveGame():void
  {
    this.gameService.navHome(); //this will unsubscripe player from gameroom as well as returning player home
  }


}
