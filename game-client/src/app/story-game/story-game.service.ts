import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Subscription } from 'rxjs/RX'
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BaseService, UserService, UserInfo } from '../core/core.service';

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
    if (gameId != "")
      this.currentGameId = gameId
    if (this.pingSubscription != null && !this.pingSubscription.closed) {
      this.pingSubscription.unsubscribe();
    }

    let timer = Observable.timer(1000, 5000);
    this.pingSubscription = timer.subscribe(t => {
      this.roomPing();
    });
    //nav with param

  }
  public getGames() {
    let test 
    this.db.list(`/storyGames/`).subscribe(res =>{
      test =res;
      console.log(test);
    });
    // this.db.list(`/storyGames/`)
    //   .switchMap(games=>{
    //   let memberObservables = [];
    //   games.forEach(player => {
    //     memberObservables.push(this.db
    //     .object(`gamePlayers/${games.$key}`)
    //     .first()
    //     .do(value => { thread.author = value.username; })
    //   );
    //   });
    // });
  
  

  //   this.projects = this.af.database.list(`projects`)
  // .map(projects => {
  //   return projects.map(project => {
  //     project.customers.map(customer => {
  //       this.af.database.list(`customers`)
  //         .subscribe(c => {
  //           customer = c;
  //         });
  //     });
  //     return project;
  //   });
  // });

  }

  public navHome() {
    this.leaveGame();
    super.navHome();
  }

  private roomPing(): void {
    //let other plays know which games are active, and the playerCount
    //calculate # of players, but count of pings done in last 5 seconds

    let fbPath = '/gamePlayers/' + this.currentGameId + '/' + this.user.uid + '/'
    console.log(fbPath);
    let ping = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      username: this.user.username
    }
    this.db.object(fbPath)
      .set(ping);
  }

  private leaveGame() {
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