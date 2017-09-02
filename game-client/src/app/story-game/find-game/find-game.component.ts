import { Component, OnInit } from '@angular/core';
import {StoryGameService} from '../story-game.service';

@Component({
  selector: 'app-find-game',
  templateUrl: './find-game.component.html',
  styleUrls: ['./find-game.component.css']
})
export class FindGameComponent implements OnInit {
  
  private gameList:any;

  constructor(private gameService: StoryGameService) { }

  ngOnInit() {
    this.getGames();
  }
  private navHome():void{
    this.gameService.navHome();
  }
  private getGames():void{
    this.gameService.getGames().subscribe(res=>{
      this.gameList = res
    });
  }
  private consoleTest():void{
    console.log(this.gameList);
  }
  private joinGame():void{
  }


}
