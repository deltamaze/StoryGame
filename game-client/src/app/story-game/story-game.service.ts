import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Subscription } from 'rxjs/RX'
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BaseService} from '../core/base.service';
import { UserService, UserInfo } from '../core/user.service';

@Injectable()
export class StoryGameService extends BaseService {

  public currentGameId: string = "";
  private user: UserInfo; //for internal use in the set username function
  private pingSubscription: Subscription;


  constructor(
    public router: Router,
    public db: AngularFireDatabase,
    public userService: UserService) {
    super(router);
    userService.getUserInfo().subscribe(item => this.user = item);
  }



  public navCreateGame(): void {
    this.router.navigate(['createGame']);
  }
  public navJoinGame(): void {

    this.router.navigate(['joinGame']);
  }

  public createGame(newgame: GameRoom):void {
    if(newgame.timeStamp == null)
    {
      newgame.timeStamp = firebase.database.ServerValue.TIMESTAMP;
    }
    //store password seperately or implement write (noread) only rule on it.
    console.log(newgame);
    let pushedGame = this.db.list('/storyGames/')
      .push(newgame).then(item => {
        console.log(item);
        this.currentGameId = item.key;
        this.joinGame();
      })
      .catch(err => this.handleError(err));
    //firebase rules, once game created, don't let it be modified
  }

  public joinGame(gameId: string = ""):void {
    //startRoomPing
    console.log("abc");
    if (gameId != "")//this will be blank when coming from the createGame component, and have gameId when coming form joinGame component
      this.currentGameId = gameId
    if (this.pingSubscription != null && !this.pingSubscription.closed) {//kill any existing ping subscription, so we can create a new one.
      this.pingSubscription.unsubscribe();
    }

    let timer = Observable.timer(1000, 5000);
    this.pingSubscription = timer.subscribe(t => {
      this.roomPing();
    });
    this.router.navigate(['gameroom']);

  }
  public getGames():Observable<any> {
    
    let playerStartAtDate = Math.floor(Date.now()) - 15000 //use as threshold to only pull players who have pinged in the past 15 seconds
    let gameStartAtDate = Math.floor(Date.now()) - 900000 //use as threshold to only pull players who have pinged in the past 15 minutes

    console.log(gameStartAtDate);
    return this.db.list(`/storyGames/`,{
            query:{
              orderByChild: 'timeStamp',
              startAt:{ value: gameStartAtDate, key: 'timeStamp' }
            }
          })
      .map(games=>{
        for (let game of games) {
          // Find each corresponding associated object and store it as a FibreaseObjectObservable

          this.db.list(`/gamePlayers/${game.$key}`).subscribe(players =>{
            game.players = players.filter(player=>{
              
              return player.timestamp > playerStartAtDate;
            });
          });
        }
        return games;
      })
    //   .subscribe(res =>{
    //   test =res;
    //   console.log(res);
    // });
  
  }

  public navHome():void {
    this.leaveGame();
    super.navHome();
  }

  private roomPing(): void {
    //let other plays know which games are active, and the playerCount
    //calculate # of players, but count of pings done in last 5 seconds

    let fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/'
    let ping = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      username: this.user.username
    }
    this.db.object(fbPath)
      .set(ping);
  }

  private leaveGame():void {
    if (this.pingSubscription != null && !this.pingSubscription.closed) {
      this.pingSubscription.unsubscribe();
    }
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
export class CurrentGameInfo {
  public gameName: string
}