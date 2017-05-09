import { NgModule }            from '@angular/core';
import { RouterModule }        from '@angular/router';

import { LogonComponent } from './pages/logon/logon.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'logon', component: LogonComponent }
  ])],
  exports: [RouterModule]
})
export class AccountRoutingModule {}

