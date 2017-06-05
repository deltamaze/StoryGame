import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Subscription } from 'rxjs/RX'
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BaseService,UserService, UserInfo } from '../core/core.service';

@Injectable()
export class StoryGameService extends BaseService {

  public currentGameId: string = "";
  private user: UserInfo; //for internal use in the set username function

  constructor(
    public router: Router,
    public db: AngularFireDatabase,
    public userService: UserService) {
    super(router);
    userService.getUserInfo().subscribe(item => this.user=item);
  }



  public navCreateGame(): void {
    this.router.navigate(['createGame']);
  }
  public navJoinGame(): void {

    this.router.navigate(['joinGame']);
  }

  public createGame(newgame: GameRoom) {
    //store password seperately or implement write (noread) only rule on it.
    this.db.list('/storyGames/')
    .push({ newgame }).then(item=>{
      this.currentGameId=item;
      this.joinGame();
    })
    .catch(err => this.handleError(err));
    //firebase rules, once game created, don't let it be modified
  }
  public joinGame(gameId:string = "") {
    //startRoomPing
    if(gameId != "")
      this.currentGameId=gameId

    let timer = Observable.timer(5000);
    timer.subscribe(t=> {
        this.roomPing();
    });

  }
  private roomPing():void{//let other plays know which games are active, and the playerCount
    //calculate # of players, but count of pings done in last 5 seconds
    let ping = {timestamp : firebase.database.ServerValue.TIMESTAMP,
                username:this.user.username }
    this.db.object('/rooms/'+this.currentGameId+'/'+this.user.uid)
    .set(ping);
  }
  public leaveGame() {
    //stop room ping
    super.navHome();
  }


}
export class GameRoom {
  public gameName: string = "";
  public isPrivate: boolean = false; //not implemented
  //public password: string = ""; //not implemented
  public maxPlayers: number = 8;
  public timeBetweenTurns: number = 30;
  public totalRounds: number = 15;
  public startingMessage: string = "Once upon a time ...";
  public timeStamp: any = firebase.database.ServerValue.TIMESTAMP;
}
export class CurrentGameInfo{
  public gameName: string
}