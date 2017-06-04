import { Component, OnInit } from '@angular/core';
import { UserService } from '../../core/user.service';



@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {
  
  private status: string = "";
  private desiredEmail: string = "";
  private desiredPassword: string = "";
  private confirmPassword: string ="";

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getErrorStatus().subscribe(status => this.status = status);  
  }
  private createAccount():void{
    if(this.validateInput()) 
      this.userService.createAccount(this.desiredEmail,this.desiredPassword);

  }
  private validateInput():boolean{
    if(this.desiredPassword===this.confirmPassword)
      return true
    else
      this.userService.handleError("Password and Confirm Password do not match.");
  }




}
