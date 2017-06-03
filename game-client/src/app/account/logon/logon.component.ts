import { Component, OnInit } from '@angular/core';
import { UserService }      from '../../core/user.service';

@Component({
  selector: 'app-logon',
  templateUrl: './logon.component.html',
  styleUrls: ['./logon.component.css']
})
export class LogonComponent implements OnInit {
  
  private email: string;
  private password: string;
  private status: string;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getErrorStatus().subscribe(status => this.status = status);
  }

  
  private login() :void{
    this.userService.login(this.email,this.password);
  }
  private googleLogin() :void{
    this.userService.googleLogin();
  }
  private guestLogin() :void{
    this.userService.guestLogin();
  }

  private logout(): void{
    this.userService.logout();
  }

}
