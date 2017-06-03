import { NgModule }            from '@angular/core';

import { SharedModule }        from '../shared/shared.module';
import { LogonComponent } from './logon/logon.component';
import { CreateAccountComponent } from './create-account/create-account.component';

// import { HeroComponent }       from './hero.component';
// import { HeroDetailComponent } from './hero-detail.component';
// import { HeroListComponent }   from './hero-list.component';
 import { AccountRoutingModule }   from './account-routing.module';
import { SetUsernameComponent } from './set-username/set-username.component';

@NgModule({
  imports: [ SharedModule
  , AccountRoutingModule ],
  declarations: [
  LogonComponent,CreateAccountComponent, SetUsernameComponent]
})
export class AccountModule { }
