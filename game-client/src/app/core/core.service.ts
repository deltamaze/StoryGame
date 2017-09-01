import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Subscription } from 'rxjs/RX'
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

export class BaseService {
  private errorStatus: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(public router: Router){}

  public getErrorStatus(): Observable<any> {
    return this.errorStatus.asObservable();
  }
  private setErrorStatus(errorMsg: string): void {
    this.errorStatus.next(errorMsg);
  }

  public handleError(err): void {
    this.setErrorStatus(err);
  }
  public clearError():void{
    this.setErrorStatus("");
  }
  public navHome():void{
    this.router.navigate(['home']);
  }
}

@Injectable()
export class UserService extends BaseService {
  public user: Observable<firebase.User>;
  private userSubscription: firebase.User; //for internal use in the set username function
  private userInfo: BehaviorSubject<UserInfo> = new BehaviorSubject<UserInfo>(new UserInfo);
  
  private authStatusSubscription: Subscription;

  constructor(public afAuth: AngularFireAuth,
    public router: Router,
    public db: AngularFireDatabase) {
    super(router);
    this.user = afAuth.authState;
    this.user.subscribe(auth => this.userSubscription = auth);

  }
  public getUserInfo(): Observable<any> {
    return this.userInfo.asObservable();
  }
  private setUserInfo(userInfo: UserInfo): void {
    this.userInfo.next(userInfo);
  }
  

  public login(email: string, password: string): void {
    this.clearError();
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => this.router.navigate(['home'])).then(() => this.verifyAuthStatus()).catch(err => this.handleError(err));

  }
  public googleLogin(): void {
    this.clearError();
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['home'])).then(() => this.verifyAuthStatus()).catch(err => this.handleError(err));;
  }
  public guestLogin(): void {
    this.clearError();
    this.afAuth.auth.signInAnonymously()
      .then(() => this.router.navigate(['home'])).then(() => this.verifyAuthStatus()).catch(err => this.handleError(err));;
  }

  public logout(): void {
    this.clearError();
    this.afAuth.auth.signOut().then(()=>{
      let userInfo: UserInfo = new UserInfo;
          userInfo.username ="";
          userInfo.uid = "";
          this.setUserInfo(userInfo);
  });
    this.router.navigate(['logon']);

  }
  public verifyAuthStatus() {
    this.clearError();
    this.authStatusSubscription = this.user.subscribe(auth => {
      if (!auth) {
        this.router.navigate(['logon']);
      }
      else {
        this.verifyUsernameStatus(auth.uid);
      }
    });
  }
  private verifyUsernameStatus(uid: string): void {
    
    this.db.object('/usernames/' + uid)
      .subscribe(item => {
        if (!item.username) {
          this.router.navigate(['setUsername']);
        }
        else if (this.router.url === '/setUsername') {//If username is already set up, and they are on the SetupUsername page, redirect them to Home
          this.router.navigate(['home']);
        }
        else {
          let userInfo: UserInfo = new UserInfo;
          userInfo.username = item.username
          userInfo.uid = uid
          this.setUserInfo(userInfo);
        }
      });
  }
  public setUsernameInFirebase(username: string): void {
    this.clearError();
    this.db.object('/usernames/' + this.userSubscription.uid).set({ username }).catch(err => this.handleError(err));
  }
  public navSignup():void{
    this.router.navigate(['createAccount']);
  }
  
  public navLogon():void{
    this.router.navigate(['logon']);
  }
  public createAccount(email: string, password: string): void {
    this.clearError();
    this.afAuth.auth.createUserWithEmailAndPassword(email, password).catch(err=>this.handleError(err));
  }
  
}

export class UserInfo{
  username="";
  uid="";
}
