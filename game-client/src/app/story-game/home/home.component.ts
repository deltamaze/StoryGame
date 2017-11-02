import { Component, OnInit } from '@angular/core';
import { StoryGameService } from '../story-game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public gameService: StoryGameService) { }

  ngOnInit() {
  }
  public navJoinGame(): void {
    this.gameService.navJoinGame();
  }
  public navCreateGame(): void {
    this.gameService.navCreateGame();
  }

}
