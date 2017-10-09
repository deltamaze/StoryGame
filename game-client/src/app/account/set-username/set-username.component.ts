import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';


@Component({
  selector: 'app-set-username',
  templateUrl: './set-username.component.html',
  styleUrls: ['./set-username.component.css']
})
export class SetUsernameComponent implements OnInit {

  public status: string = "";
  public desiredUsername: string = "";

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getErrorStatus().subscribe(status => this.status = status);
  }
  public setUsername(): void {
    if(this.validateInput())
      this.userService.setUsernameInFirebase(this.desiredUsername);
  }
  public validateInput():boolean
  {
    if(this.desiredUsername.length >=3 && this.desiredUsername.length <=20)
      return true;
    else
      return false;
  }


}
