import { Component, OnInit } from '@angular/core';
import { StoryGameService } from '../story-game.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {

  public gameList: any;
  public status = "";

  constructor(public gameService: StoryGameService) { }

  ngOnInit() {
    this.gameService.getErrorStatus().subscribe(status => this.status = status);
    this.getGames();
  }
  public navHome(): void {
    this.gameService.navHome();
  }
  public getGames(): void {
    this.gameService.getGames().subscribe(res => {
      this.gameList = res;
    });
  }

  public joinGame(gameKey: any): void {
    this.gameService.joinGame(gameKey);
  }

  public consoleTest(): void {

  }


}
