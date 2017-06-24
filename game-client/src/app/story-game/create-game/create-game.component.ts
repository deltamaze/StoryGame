import { Component, OnInit } from '@angular/core';
import { StoryGameService, GameRoom } from '../story-game.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {

  private newGame: GameRoom = new GameRoom;
  private status: string;
  constructor(private gameService: StoryGameService) { }

  ngOnInit() {
    this.gameService.getErrorStatus().subscribe(status => this.status = status);
  }
  private navHome(): void {
    this.gameService.navHome();
  }
  private createGame(): void {
    if(this.validateInput())
      this.gameService.createGame(this.newGame);
  }
  private validateInput(): boolean {
    if (!(this.newGame.gameName.length <= 10 && this.newGame.gameName.length >= 3)) //game name longer than 3 characters, and less than 10
    {
      this.gameService.handleError("Game Name needs to be between 3 and 10 characters");
      return false;
    }
    else if (!(this.newGame.maxPlayers <= 8 && this.newGame.maxPlayers >= 3))//max players between 3 and 8
    {
      this.gameService.handleError("Max Players need to be between 3 and 8 players");
      return false;
    }
    else if (!(this.newGame.timeBetweenTurns <= 60 && this.newGame.timeBetweenTurns >= 5))//turn length between 5 and 60 seconds
    {
      this.gameService.handleError("Turn Length must be between 5 and 60 seconds");
      return false;
    }
    else if (!(this.newGame.totalRounds <= 30 && this.newGame.totalRounds >= 5))//max turns between 5 and 30
    {
      this.gameService.handleError("Game Rounds must be between 5 and 30 rounds");
      return false;
    }
    else if (!(this.newGame.startingMessage.length <= 200 && this.newGame.startingMessage.length >= 5))//starting sentence between 5 and 200 words
    {
      this.gameService.handleError("Starting Sentence needs a length between 5 and 200 characters.");
      return false;
    }
    // else if (this.newGame.password.length > 20)//starting sentence between 5 and 200 words
    // {
    //   this.gameService.handleError("Password needs to have a length less than 20 characters.");
    //   return false;
    // }
    else {
      this.gameService.clearError();
      return true;
    }
  }

}
