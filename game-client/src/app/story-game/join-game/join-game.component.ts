import { Component, OnInit } from '@angular/core';
import {StoryGameService} from '../story-game.service';

@Component({
  selector: 'app-join-game',
  templateUrl: './join-game.component.html',
  styleUrls: ['./join-game.component.css']
})
export class JoinGameComponent implements OnInit {
  
  private gameList:any;
  private status: string = "";

  constructor(private gameService: StoryGameService) { }

  ngOnInit() {
    this.gameService.getErrorStatus().subscribe(status => this.status = status);
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
    
  }
  private joinGame(gameKey:any):void{
    console.log(gameKey);
    this.gameService.joinGame(gameKey);
  }


}
