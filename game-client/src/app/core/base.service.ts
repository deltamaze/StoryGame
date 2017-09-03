import { Injectable, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject, Subscription } from 'rxjs/RX'
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

export class BaseService {
  private errorStatus: BehaviorSubject<string> = new BehaviorSubject<string>("");

  constructor(public router: Router) { }

  public getErrorStatus(): Observable<any> {
    return this.errorStatus.asObservable();
  }
  private setErrorStatus(errorMsg: string): void {
    this.errorStatus.next(errorMsg);
  }

  public handleError(err): void {
    this.setErrorStatus(err);
  }
  public clearError(): void {
    this.setErrorStatus("");
  }
  public navHome(): void {
    this.router.navigate(['home']);
  }
}
