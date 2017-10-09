import { Component, OnInit } from '@angular/core';
import { UserService }      from '../../core/user.service';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {
  
  public email: string;
  public password: string;
  public status: string;

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getErrorStatus().subscribe(status => this.status = status);
  }

  
  public login() :void{
    this.userService.login(this.email,this.password);
  }
  public googleLogin() :void{
    this.userService.googleLogin();
  }
  public guestLogin() :void{
    this.userService.guestLogin();
  }
  public signUp(): void{
    this.userService.navSignup();
  }

  public logout(): void{
    this.userService.logout();
  }

}
