import { Component, OnInit } from '@angular/core';
import {StoryGameService} from '../story-game.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {
  
  public status: string = "";
  public chatMessages: any;
  public chatInput: string;
  public playerList: any;
  public gameStory: any;
  public gameInfo: any;
  public ideaInput: string;
  public playerInputs: any;
  public disableButton: boolean = false;



  constructor(public gameService: StoryGameService) { }

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

  public temporarilyDisableButton():void{
    this.disableButton = true;
    console.log(this.disableButton);
        setTimeout(()=> {
          this.disableButton = false;
          console.log(this.disableButton);
    }, 2000);
  }

  public submitChatMessage():void
  {
    this.gameService.submitChatMessage(this.chatInput);
    this.chatInput = "";//clear input
    this.gameService.clearError();

  }
  public startGame(): void
  {
    this.temporarilyDisableButton(); //prevent a double click, causing 2 posts to the web api
    this.gameService.startGame();
  }
  public submitIdea():void
  {
    this.gameService.submitInput(this.ideaInput,this.gameInfo.currentRound);
  }
  public submiteVote(ideaKey):void
  {
    //clear out idea variable, to get ready for next round
    this.ideaInput = "";
    this.gameService.submitInput(ideaKey,this.gameInfo.currentRound);
  }
  public leaveGame():void
  {
    this.gameService.navHome(); //this will unsubscripe player from gameroom as well as returning player home
  }
  public consoleTest():void
  {
    console.log(this.playerInputs.find(o => o.$key === (parseInt(this.gameInfo.currentRound)-1).toString()));
  }
  public displayThisRound(roundNum: string):boolean
  {
    //only display input for the round that is = to this round - 1
    return((parseInt(this.gameInfo.currentRound)-1 )== parseInt(roundNum) ); 
  }
  public displayThisInput(inputUID: string):boolean
  {
    //return true;
    //only display input that isn't your own.
    return(this.gameService.user.uid != inputUID)
    //to debug, lets just return true for now
    //return true;
  }
  public isMyActionComplete():boolean
  {
    // this.playerList.forEach(player => {
    //   //find self
    //   if(player.$key == this.gameService.user.uid && player.isActionFinished ==true )
    //     return true;
    // });
    //update loop logic to resemble isHostStillInGame, instead of passing into another function
    
     return false;
  }
  public isHostStillInGame():boolean
  {
    for (var player in this.playerList) {
      if (this.playerList.hasOwnProperty(player)) {
          if(this.playerList[player].$key == this.gameInfo.creatorUid && this.playerList[player].pingTime > Math.floor(Date.now()) - 10000)
          {
            return true;
          }
      }
    }
    return false;
  }
  public isWithin10Seconds(time:number):boolean
  {
    return time > Math.floor(Date.now()) - 10000
  }
}

