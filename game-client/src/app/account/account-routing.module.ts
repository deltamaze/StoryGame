import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { LogonComponent } from './logon/logon.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { SetUsernameComponent } from './set-username/set-username.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'logon', component: LogonComponent },
    { path: 'createAccount', component: CreateAccountComponent },
    { path: 'setUsername', component: SetUsernameComponent }
  ])],
  exports: [RouterModule]
})
export class AccountRoutingModule {}

