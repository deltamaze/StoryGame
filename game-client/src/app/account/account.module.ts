import { NgModule }            from '@angular/core';

import { SharedModule }        from '../shared/shared.module';
import { LogonComponent } from './pages/logon/logon.component';

// import { HeroComponent }       from './hero.component';
// import { HeroDetailComponent } from './hero-detail.component';
// import { HeroListComponent }   from './hero-list.component';
 import { AccountRoutingModule }   from './account-routing.module';

@NgModule({
  imports: [ SharedModule
  , AccountRoutingModule ],
  declarations: [
  LogonComponent]
})
export class AccountModule { }
