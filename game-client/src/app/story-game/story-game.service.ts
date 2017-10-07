import { Injectable, Optional } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Subscription } from 'rxjs/RX'
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { BaseService} from '../core/base.service';
import { UserService, UserInfo } from '../core/user.service';

@Injectable()
export class StoryGameService extends BaseService {

  public currentGameId: string = "";
  public user: UserInfo; //for internal use in the set username function
  private pingSubscription: Subscription;
  private gameApiUrl:string = 'http://localhost:8080/';

  constructor(
    public router: Router,
    public db: AngularFireDatabase,
    public userService: UserService,
    private http: Http) {
    super(router);
    userService.getUserInfo().subscribe(item => this.user = item);
  }



  public navCreateGame(): void {
    super.clearError();
    this.router.navigate(['createGame']);
  }
  public navJoinGame(): void {
    super.clearError();
    this.router.navigate(['joinGame']);
  }

  public createGame(newgame: GameRoom):void {
    super.clearError();
    
    newgame.timestamp = firebase.database.ServerValue.TIMESTAMP;
    newgame.currentRound = 0;
    newgame.creatorUid = this.user.uid;
    newgame.isGameOver = false;
    newgame.timeLeftInRound=  0;
    newgame.gameTimeElapsed= 0;
    //store password seperately or implement write (noread) only rule on it.
    
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
    super.clearError();
    if (gameId != "")//this will be blank when coming from the createGame component, and have gameId when coming form joinGame component
      this.currentGameId = gameId
    if (this.pingSubscription != null && !this.pingSubscription.closed) {//kill any existing ping subscription, so we can create a new one.
      this.pingSubscription.unsubscribe();
    }

    let fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/'
    let playerInfo = {
      joinTime: firebase.database.ServerValue.TIMESTAMP,
      pingTime: firebase.database.ServerValue.TIMESTAMP,
      lastActionTime: firebase.database.ServerValue.TIMESTAMP,
      score: 0,
      isActionFinished: false,
      isActive : false,
      isActiveStartTime : 0,
      username: this.user.username
    }
    this.db.object(fbPath)
      .set(playerInfo).catch(err=>this.handleError(err));

    let timer = Observable.timer(1000, 5000);
    this.pingSubscription = timer.subscribe(t => {
      this.roomPing();
    });
    this.router.navigate(['gameroom']);

  }
  public getGames():Observable<any> {
    

    return this.db.list(`/storyGames/`,{
            query:{
              orderByChild: 'timestamp',
              startAt:{ value: Math.floor(Date.now()) - 300000 , key: 'timestamp' }//use as threshold to only pull games that were started 55 min ago
            }
          })
      .map(games=>{
        for (let game of games) {
          // Find each corresponding associated object and store it as a FibreaseObjectObservable

          this.db.list(`/gamePlayers/${game.$key}`).subscribe(players =>{
            game.players = players.filter(player=>{
              
              return player.pingTime > Math.floor(Date.now()) - 15000 ; //use as threshold to only pull players who have pinged in the past 15 seconds

            });
          });
        }
        return games;
      })
  
  }

  public navHome():void {
    this.leaveGame();
    super.navHome();
  }
  private updateLastActionTime():void
  {
    let fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/lastActionTime'
    let time = firebase.database.ServerValue.TIMESTAMP;
    this.db.object(fbPath)
      .set(time).catch(err=>this.handleError(err));
  }

  private roomPing(): void {
    //let other plays know which games are active, and the playerCount
    //calculate # of players, but count of pings done in last 5 seconds

    let fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/pingTime'
    let ping = firebase.database.ServerValue.TIMESTAMP;
    this.db.object(fbPath)
      .set(ping).catch(err=>this.pingDisconnected());
  }
  private pingDisconnected():void
  {
    
    
    this.leaveGame();
    this.navJoinGame();
    super.handleError("Disconnected from game for In-Activity");

  }
  public getPlayerList():FirebaseListObservable<any>{
    
    return this.db.list('/gamePlayers/' + this.currentGameId+'/')
  }

  private leaveGame():void {
    if (this.pingSubscription != null && !this.pingSubscription.closed) {
      this.pingSubscription.unsubscribe();
    }
    this.currentGameId="";
  }

  public getGameInfo():FirebaseObjectObservable<any>
  {
    return this.db.object('/storyGames/' + this.currentGameId + '/')
  }

  public submitChatMessage(input: string):void
  {
    let packedMessage = {
      username:this.user.username,
      uid: this.user.uid,
      message:input,
      timestamp:firebase.database.ServerValue.TIMESTAMP

    }
    this.db.list('/gamePlayerChat/' + this.currentGameId + '/')
      .push(packedMessage).catch(err => this.handleError(err));
  }
  public getChatMessages():FirebaseListObservable<any>
  {
    return this.db.list('/gamePlayerChat/' + this.currentGameId + '/')
  }
  public submitInput(idea: string,roundNumber: number):void
  {
    let input = {
      username:this.user.username,
      input:idea,
      timestamp:firebase.database.ServerValue.TIMESTAMP
    }
    this.db.object('/gamePlayerInput/' + this.currentGameId + '/'+roundNumber.toString()+'/'+this.user.uid+'/').set(input).catch(err => this.handleError(err));
    this.updateLastActionTime();
  }
  public getPlayerInputs():FirebaseListObservable<any>
  {
    //gamePlayerInput
    return this.db.list('/gamePlayerInput/' + this.currentGameId + '/')

  }
  public verifyInGameStatus() {
    if(this.currentGameId == null || this.currentGameId=="")
    {
      //not in game, return home
      super.navHome();
    }
  }

  public startGame() {
    this.http.post(this.gameApiUrl+'StartStoryGame/'+ this.currentGameId ,null)
    .subscribe({ error: err => this.handleError(err)});
  }

}
export class GameRoom {
  public gameName: string = "";
  public isPrivate: boolean = false; //not implemented
  //public password: string = ""; //not implemented
  public maxPlayers: number = 8;
  public timeBetweenTurns: number = 30;
  public totalRounds: number = 15;
  public storyThusFar: string = "Once upon a time,";
  public timestamp: any = firebase.database.ServerValue.TIMESTAMP;
  public currentRound: number = 0;//when creating, start at round zero, when game starts , the api will turn this into round 1..2..3..etc
  public creatorUid:string= "0";
  public isGameOver: boolean = false;
  public timeLeftInRound: number =  0;
  public gameTimeElapsed: number = 0;

}
export class CurrentGameInfo {
  public gameName: string
}