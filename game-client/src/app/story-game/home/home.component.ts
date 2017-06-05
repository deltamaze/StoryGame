import { Component, OnInit } from '@angular/core';
import {StoryGameService} from '../story-game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private gameService: StoryGameService) { }

  ngOnInit() {
  }
  private navJoinGame():void{
    this.gameService.navJoinGame();
  }
  private navCreateGame():void{
    this.gameService.navCreateGame();
  }

}
