import { Component, OnInit } from '@angular/core';
import { StoryGameService } from '../story-game.service';
import { Subject } from 'rxjs/Rx';

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
  private ideaInputChanged = new Subject<string>();
  private lastRoundSubmit = 0;
  public playerInputs: any;
  public disableButton = false;
  public disableStartButton = false;
  public lastVote: string;
  public maxCharacterCount = 100;
  public hurryThreshold = 5;
  public saveMessage = 'Your Idea was saved! You can make changes before time is up!';



  constructor(public gameService: StoryGameService) { }

  ngOnInit() {
    // make sure player is in game, and didn't nav straight here without joining a game
    this.gameService.verifyInGameStatus();
    this.gameService.getRoundWinners().subscribe(res => {
      this.roundWinners = res;
    });

    this.ideaInputChanged.debounceTime(300).distinctUntilChanged()
      .subscribe(idea => this.submitIdea(true));

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

  public submitChatMessage(): void {
    this.gameService.submitChatMessage(this.chatInput);
    this.chatInput = ""; // clear input
    this.gameService.clearError();

  }
  public startGame(): void {
    this.disableStartButton = true;
    this.gameService.startGame();
  }
  public autoSaveIdea() {
    this.ideaInputChanged.next(this.ideaInput);
  }
  public submitIdea(isAutoSave: boolean): void {
    this.lastVote = ""; // clear out last vote
    // autosave should not mark player as ready, unless they already did a manual submit
    this.gameService.submitInput(this.ideaInput, this.gameInfo.currentTurn);
    if (isAutoSave === true) {
      console.log("autosaved idea");
      this.saveMessage = 'Auto-saved!';
      // autosave should not mark player as ready, unless they already did a manual submit

    }
    if (isAutoSave === false) {
      this.temporarilyDisableButton();
      this.saveMessage = 'Your Idea was saved! You can make changes before time is up!';
      this.lastRoundSubmit = this.gameInfo.currentRound;
    }
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
    return (this.gameService.user.uid !== inputUID);
  }
  public isMyActionComplete(): boolean {

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
}

