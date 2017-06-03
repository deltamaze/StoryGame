// Crazy copy of the app/user.service
// Proves that UserService is an app-wide singleton and only instantiated once
// IFF shared.module follows the `forRoot` pattern
//
// If it didn't, a new instance of UserService would be created
// after each lazy load and the userName would double up.

import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject,Subscription } from 'rxjs/RX'
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Injectable()
export class UserService {
  public user: Observable<firebase.User>;
  private userSubscription:firebase.User; //for internal use in the set username function
  private username: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private errorStatus: BehaviorSubject<string> = new BehaviorSubject<string>("");
  private authStatusSubscription: Subscription;

  constructor(public afAuth: AngularFireAuth,
    private router: Router,
    public db: AngularFireDatabase) {
    this.user = afAuth.authState;
    this.user.subscribe(auth => this.userSubscription = auth);

  }


  public getUsername(): Observable<any> {
    return this.username.asObservable();
  }
  private setUsername(username: string): void {
    this.username.next(username);
  }
  public getErrorStatus():Observable<any>{
    return this.errorStatus.asObservable();
  }
  private setErrorStatus(errorMsg: string): void {
    this.errorStatus.next(errorMsg);
  }

  public login(email: string, password: string): void {
    // this.status.text = "";
    // this.af.auth.login({
    // email: email,
    // password: password
    // }).then(() => {
    // this.router.navigate(['Home']);
    // }).catch(err => this.handleError(err));
    this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => this.router.navigate(['home'])).catch(err=>this.handleError(err));
    //.then;

  }
  public googleLogin(): void {
    // this.status.text = "";
    // this.af.auth.login({
    // provider: AuthProviders.Google,
    // method: AuthMethods.Popup
    // }).then(() => {
    // this.router.navigate(['Home']);
    // }).catch(err => this.handleError(err));
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .then(() => this.router.navigate(['home'])).catch(err=>this.handleError(err));;
  }
  public guestLogin(): void {
    // this.status.text = "";
    // this.af.auth.login({
    // provider: AuthProviders.Anonymous,
    // method: AuthMethods.Anonymous
    // }).then(() => {
    // this.router.navigate(['Home']);
    // }).catch(err => this.handleError(err));
    this.afAuth.auth.signInAnonymously()
      .then(() => this.router.navigate(['home'])).catch(err=>this.handleError(err));;
  }

  public logout(): void {
    this.afAuth.auth.signOut();
    //this.authStatusSubscription.unsubscribe();
    this.router.navigate(['logon']);

  }
  public verifyAuthStatus() {
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
    console.log(uid);
    this.db.object('/usernames/' + uid )
      .subscribe(item => {
        console.log(item);
        if (!item.username) {
          this.router.navigate(['setUsername']);
        }
        else if (this.router.url === '/setUsername') {//If username is already set up, and they are on the SetupUsername page, redirect them to Home
          this.router.navigate(['home']);
        }
        else {
          this.setUsername(item);
        }
      });
  }
  public setUsernameInFirebase(username: string):void{
    this.db.object('/usernames/' + this.userSubscription.uid ).set({username}).catch(err => this.handleError(err));
  }
  public handleError(err): void {
    this.setErrorStatus(err);  
  }
}


