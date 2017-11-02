import { TestBed, inject } from '@angular/core/testing';
import { UserService } from './user.service';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireModule } from 'angularfire2';
import { environment } from '../../environments/environment';


class AngularFireDBMock extends AngularFireDatabase {
  // public auth: AngularFireAuthMock;
}

describe('UserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AngularFireModule.initializeApp(environment.firebase)],
      providers: [UserService,
      { provide: AngularFireDatabase, useClass: AngularFireDBMock } ]
    });
  });

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));

  it('should let user log on', inject([UserService], (service: UserService) => {
    expect(service).toBeFalsy();
  }));

  it('should let user log out', inject([UserService], (service: UserService) => {
    expect(service).toBeFalsy();
  }));

  it('check logged on status', inject([UserService], (service: UserService) => {
    expect(service).toBeFalsy();
  }));

   it('should redirect User to logon page if not signed in',
    inject([UserService], (service: UserService) => {
    expect(service).toBeFalsy();
  }));

});
