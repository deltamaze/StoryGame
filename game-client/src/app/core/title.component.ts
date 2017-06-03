// Exact copy of app/title.component.ts except import UserService from shared
import { Component, Input } from '@angular/core';
import { UserService }      from '../core/user.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
})
export class TitleComponent {
  title = 'Story Game';
  user = '';

  constructor(private userService: UserService) {
    userService.verifyAuthStatus();
    userService.getUsername().subscribe(item => this.user = item);
  }
}
