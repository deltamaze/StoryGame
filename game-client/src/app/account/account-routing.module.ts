import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { LogonComponent } from './logon/logon.component';
import { CreateAccountComponent } from './create-account/create-account.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'logon', component: LogonComponent },
    { path: 'createaccount', component: CreateAccountComponent }
  ])],
  exports: [RouterModule]
})
export class AccountRoutingModule {}

