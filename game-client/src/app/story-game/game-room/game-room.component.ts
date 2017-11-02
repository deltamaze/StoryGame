import { Component, OnInit } from '@angular/core';
import { StoryGameService } from '../story-game.service';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.css']
})
export class GameRoomComponent implements OnInit {
  public status = "";
  public chatMessages: any;
  public chatInput: string;
  public playerList: any;
  public roundWinners: any;
  public gameStory: any;
  public gameInfo: any;
  public ideaInput = "";
  public playerInputs: any;
  public disableButton = false;
  public lastVote: string;
  public maxCharacterCount = 100;
  public hurryThreshold = 5;




  constructor(public gameService: StoryGameService) { }

  ngOnInit() {
    // make sure player is in game, and didn't nav straight here without joining a game
    this.gameService.verifyInGameStatus();
    this.gameService.getRoundWinners().subscribe(res => {
      this.roundWinners = res;
    });

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

  public temporarilyDisableButton(): void {
    this.disableButton = true;
    console.log(this.disableButton);
    setTimeout(() => {
      this.disableButton = false;
      console.log(this.disableButton);
    }, 1000);
  }
  public getLastRoundWinner(): string {
    return "John Doe";
  }

  public submitChatMessage(): void {
    this.gameService.submitChatMessage(this.chatInput);
    this.chatInput = ""; // clear input
    this.gameService.clearError();

  }
  public startGame(): void {
    this.temporarilyDisableButton();
    this.gameService.startGame();
  }
  public submitIdea(): void {
    this.temporarilyDisableButton();
    this.lastVote = ""; // clear out last vote
    this.gameService.submitInput(this.ideaInput, this.gameInfo.currentTurn);
  }
  public submiteVote(ideaKey): void {
    // clear out idea variable, to get ready for next round
    this.temporarilyDisableButton();
    this.lastVote = ideaKey; // use to determine where to play Check mark
    this.ideaInput = "";
    this.gameService.submitInput(ideaKey, this.gameInfo.currentTurn);
  }
  public leaveGame(): void {
    // this will unsubscripe player from gameroom as well as returning player home
    this.gameService.navHome();
  }

  public displayThisRound(roundNum: string): boolean {
    // only display input for the round that is = to this round - 1
    return ((parseInt(this.gameInfo.currentTurn, 10) - 1) === parseInt(roundNum, 10));
  }
  public displayThisInput(inputUID: string): boolean {
    // return true;
    // only display input that isn't your own.
    return (this.gameService.user.uid !== inputUID);
    // to debug, lets just return true for now
    // return true;
  }
  public isMyActionComplete(): boolean {
    // this.playerList.forEach(player => {
    //   //find self
    //   if(player.$key == this.gameService.user.uid && player.isActionFinished ==true )
    //     return true;
    // });
    // update loop logic to resemble isHostStillInGame, instead of passing into another function

    for (const player in this.playerList) {
      if (this.playerList.hasOwnProperty(player)) {
        if (this.playerList[player].$key === this.gameService.user.uid &&
          this.playerList[player].isActionFinished === true) {
          return true;
        }
      }
    }
    return false;
  }
  public isHostStillInGame(): boolean {
    for (const player in this.playerList) {
      if (this.playerList.hasOwnProperty(player)) {
        if (this.playerList[player].$key === this.gameInfo.creatorUid && // host in game
          // host last ping within 10 seconds
          this.playerList[player].pingTime > Math.floor(Date.now()) - 10000) {
          return true;
        }
      }
    }
    return false;
  }
  public isWithin10Seconds(time: number): boolean {
    return time > Math.floor(Date.now()) - 10000;
  }
  // public consoleTest():void//used for debugging, ignore
  // {
  //   console.log(
  //     this.playerInputs.find(o => o.$key === (parseInt(this.gameInfo.currentTurn)-1).toString())
  //     );
  // }
}

