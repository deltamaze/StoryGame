import { Injectable, Optional } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import {
  AngularFireDatabase,
  FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database';
import { BaseService } from '../core/base.service';
import { UserService, UserInfo } from '../core/user.service';

@Injectable()
export class StoryGameService extends BaseService {

  public currentGameId = "";
  public user: UserInfo;
  private pingSubscription: Subscription;
  // DEV
  // private gameApiUrl = 'http://localhost:8080/';
  // PROD
   private gameApiUrl = 'https://storygameapi.kilomaze.com/';

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

  public createGame(newgame: any): void {
    super.clearError();

    newgame.timestamp = firebase.database.ServerValue.TIMESTAMP;
    newgame.currentTurn = 0;
    newgame.currentRound = 0;
    newgame.creatorUid = this.user.uid;
    newgame.isGameOver = false;
    newgame.timeLeftInTurn = 0;
    newgame.gameTimeElapsed = 0;
    newgame.gameOverReason = '';
    // store password seperately or implement write (noread) only rule on it.

    const pushedGame = this.db.list('/storyGames/')
      .push(newgame).then(item => {
        console.log(item);
        this.currentGameId = item.key;
        this.joinGame();
      })
      .catch(err => this.handleError(err));
    // firebase rules, once game created, don't let it be modified
  }

  public joinGame(gameId: string = ""): void {
    super.clearError();
    // this will be blank when coming from the createGame component
    // this will have value when coming form joinGame component
    if (gameId !== "") {
      this.currentGameId = gameId;
    }
    // kill any existing ping subscription, so we can create a new one.
    if (this.pingSubscription != null && !this.pingSubscription.closed) {
      this.pingSubscription.unsubscribe();
    }

    const fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/';
    const playerInfo = {
      joinTime: firebase.database.ServerValue.TIMESTAMP,
      pingTime: firebase.database.ServerValue.TIMESTAMP,
      lastActionTime: firebase.database.ServerValue.TIMESTAMP,
      score: 0,
      isActionFinished: false,
      isActive: false,
      isActiveStartTime: 0,
      username: this.user.username
    };
    this.db.object(fbPath)
      .set(playerInfo).catch(err => this.handleError(err));

    const timer = Observable.timer(1000, 5000);
    this.pingSubscription = timer.subscribe(t => {
      this.roomPing();
    });
    this.router.navigate(['gameroom']);

  }
  public getGames(): Observable<any> {


    return this.db.list(`/storyGames/`, {
      // use as threshold to only pull games that were started 300000 millisec ago
      query: {
        orderByChild: 'timestamp',
        startAt: { value: Math.floor(Date.now()) - 300000, key: 'timestamp' }
      }
    })
      .map(games => {
        for (const game of games) {
          // Find each corresponding associated object and store it as a FibreaseObjectObservable
          this.db.list(`/gamePlayers/${game.$key}`).subscribe(players => {
            game.players = players.filter(player => {
              // use as threshold to only pull players who have pinged in the past 15 seconds
              return player.pingTime > Math.floor(Date.now()) - 15000;
            });
          });
        }
        return games;
      });

  }

  public navHome(): void {
    this.leaveGame();
    super.navHome();
  }
  private updateLastActionTime(): void {
    const fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/lastActionTime';
    const time = firebase.database.ServerValue.TIMESTAMP;
    this.db.object(fbPath)
      .set(time).catch(err => this.handleError(err));
  }

  private roomPing(): void {
    // let other plays know which games are active, and the playerCount
    // calculate # of players, but count of pings done in last 5 seconds

    const fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/pingTime';
    const ping = firebase.database.ServerValue.TIMESTAMP;
    this.db.object(fbPath)
      .set(ping).catch(err => this.kickByServer());
    if (this.user.username === '')
    {
      // player logged out, cancel ping
      this.leaveGame();
    }
  }
  private kickByServer(): void {


    this.leaveGame();
    this.navJoinGame();
    super.handleError("Disconnected from game for In-Activity");

  }
  public getPlayerList(): FirebaseListObservable<any> {

    return this.db.list('/gamePlayers/' + this.currentGameId + '/');
  }

  private leaveGame(): void {
    if (this.pingSubscription != null && !this.pingSubscription.closed) {
      this.pingSubscription.unsubscribe();
    }
    this.currentGameId = "";
  }

  public getGameInfo(): FirebaseObjectObservable<any> {
    return this.db.object('/storyGames/' + this.currentGameId + '/');
  }

  public submitChatMessage(input: string): void {
    const packedMessage = {
      username: this.user.username,
      uid: this.user.uid,
      message: input,
      timestamp: firebase.database.ServerValue.TIMESTAMP

    };
    this.db.list('/gamePlayerChat/' + this.currentGameId + '/')
      .push(packedMessage).catch(err => this.handleError(err));
  }

  public getChatMessages(): FirebaseListObservable<any> {
    return this.db.list('/gamePlayerChat/' + this.currentGameId + '/');
  }
  public getRoundWinners(): FirebaseListObservable<any> {
    return this.db.list('/gameRoundWinners/' + this.currentGameId + '/');
  }
  public submitInput(idea: string, roundNumber: number): void {
    const input = {
      username: this.user.username,
      input: idea,
      votes: 0,
      isWinner: false,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    };
    this.db.object('/gamePlayerInput/' + this.currentGameId + '/' +
      roundNumber.toString() + '/' + this.user.uid + '/')
      .set(input)
      .catch(err => this.handleError(err));
    this.updateLastActionTime();
  }
  public getPlayerInputs(): FirebaseListObservable<any> {
    // gamePlayerInput
    return this.db.list('/gamePlayerInput/' + this.currentGameId + '/');

  }
  public verifyInGameStatus() {
    if (this.currentGameId == null || this.currentGameId === "") {
      // not in game, return home
      super.navHome();
    }
  }

  public startGame() {
    this.http.post(this.gameApiUrl + 'StartStoryGame/' + this.currentGameId, null)
      .subscribe({ error: err => this.handleError(err) });
  }

}
