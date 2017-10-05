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
  private playerInputs: any;
  private disableButton: boolean = false;



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
    this.gameService.getPlayerInputs().subscribe(res => {
      this.playerInputs = res;
    });
  }

  private temporarilyDisableButton():void{
    this.disableButton = true;
    console.log(this.disableButton);
        setTimeout(()=> {
          this.disableButton = false;
          console.log(this.disableButton);
    }, 2000);
  }

  private submitChatMessage():void
  {
    this.gameService.submitChatMessage(this.chatInput);
    this.chatInput = "";//clear input
    this.gameService.clearError();

  }
  private startGame(): void
  {
    this.temporarilyDisableButton(); //prevent a double click, causing 2 posts to the web api
    this.gameService.startGame();
  }
  private submitIdea():void
  {
    this.temporarilyDisableButton();
    this.gameService.submitInput(this.ideaInput,this.gameInfo.currentRound);
  }
  private submiteVote(ideaKey):void
  {
    this.temporarilyDisableButton();
    this.gameService.submitInput(ideaKey,this.gameInfo.currentRound);
  }
  private leaveGame():void
  {
    this.gameService.navHome(); //this will unsubscripe player from gameroom as well as returning player home
  }
  private consoleTest():void
  {
    console.log(this.playerInputs.find(o => o.$key === (parseInt(this.gameInfo.currentRound)-1).toString()));
  }
  private displayThisRound(roundNum: string):boolean
  {
    //only display input for the round that is = to this round - 1
    return((parseInt(this.gameInfo.currentRound)-1 )== parseInt(roundNum) ); 
  }
  private displayThisInput(inputUID: string):boolean
  {
    //return true;
    //only display input that isn't your own.
    return(this.gameService.user.uid != inputUID)
    //to debug, lets just return true for now
    //return true;
  }
  private isActionComplete():boolean
  {
    this.playerList.forEach(player => {
      //find self
      if(player.$key == this.gameService.user.uid && player.isActionFinished ==true )
        return true;
    });
    return false;
  }
}

