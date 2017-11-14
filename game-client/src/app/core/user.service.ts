import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Subscription } from 'rxjs/Rx';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { BaseService } from './base.service';

@Injectable()
export class UserService extends BaseService {
  public user: Observable<firebase.User>;
  private userSubscription: firebase.User; // for internal use in the set username function
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
      .then(() => this.router.navigate(['home']))
      .then(() => this.verifyAuthStatus())
      .catch(err => this.handleError(err));

  }
  public googleLogin(): void {
    this.clearError();
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['home']))
      .then(() => this.verifyAuthStatus())
      .catch(err => this.handleError(err));
  }
  public guestLogin(): void {
    this.clearError();
    this.afAuth.auth.signInAnonymously()
      .then(() => this.router.navigate(['home']))
      .then(() => this.verifyAuthStatus())
      .catch(err => this.handleError(err));
  }

  public logout(): void {
    this.clearError();
    this.afAuth.auth.signOut()
      .then(() => {
        const userInfo: UserInfo = new UserInfo;
        userInfo.username = "";
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
        // If username is already set up, & they are on the SetupUsername page, redirect to Home
        else if (this.router.url === '/setUsername') {
          this.router.navigate(['home']);
        }
        else {
          const userInfo: UserInfo = new UserInfo;
          userInfo.username = item.username;
          userInfo.uid = uid;
          this.setUserInfo(userInfo);
        }
      });
  }
  public setUsernameInFirebase(username: string): void {
    this.clearError();
    this.db.object('/usernames/' + this.userSubscription.uid).set({ username })
      .then(() => this.verifyAuthStatus())
      .catch(err => this.handleError(err));
  }
  public navSignup(): void {
    this.router.navigate(['createAccount']);
  }

  public navLogon(): void {
    this.router.navigate(['logon']);
  }
  public createAccount(email: string, password: string): void {
    this.clearError();
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .catch(err => this.handleError(err));
  }

}

export class UserInfo {
  public username = "";
  public uid = "";
}
