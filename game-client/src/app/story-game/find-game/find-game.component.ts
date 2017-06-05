import { Component, OnInit } from '@angular/core';
import {StoryGameService} from '../story-game.service';

@Component({
  selector: 'app-find-game',
  templateUrl: './find-game.component.html',
  styleUrls: ['./find-game.component.css']
})
export class FindGameComponent implements OnInit {
  
  constructor(private gameService: StoryGameService) { }

  ngOnInit() {
  }
  private navHome():void{
    this.gameService.navHome();
  }


}
