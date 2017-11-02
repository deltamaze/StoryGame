// Exact copy of app/title.component.ts except import UserService from shared
import { Component, Input } from '@angular/core';
import { UserService, UserInfo } from '../core/user.service';

@Component({
  selector: 'app-title',
  templateUrl: './title.component.html',
})
export class TitleComponent {
  title = "Story Game - Pre-Alpha";
  user: UserInfo;

  constructor(private userService: UserService) {
    userService.verifyAuthStatus();
    userService.getUserInfo().subscribe(item => this.user = item);
  }
  private navHome(): void {
    this.userService.navHome();
  }

  private navLogon(): void {
    this.userService.navLogon();
  }
  private logout(): void {
    this.userService.logout();
  }
}
