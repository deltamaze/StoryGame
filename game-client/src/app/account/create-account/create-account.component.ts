import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';



@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  public status = "";
  public desiredEmail = '';
  public desiredPassword = '';
  public confirmPassword = '';

  constructor(public userService: UserService) { }

  ngOnInit() {
    this.userService.getErrorStatus().subscribe(status => this.status = status);
  }
  public createAccount(): void {
    if (this.validateInput()) {
      this.userService.createAccount(this.desiredEmail, this.desiredPassword);
    }
  }
  public validateInput(): boolean {
    if (this.desiredPassword === this.confirmPassword) {
      return true;
    }
    else {
      this.userService.handleError('Password and Confirm Password do not match.');
    }
  }
}
