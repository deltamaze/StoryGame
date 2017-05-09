
import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';


/* App Root */
import { AppComponent }   from './app.component';

/* Feature Modules */
import { AccountModule }    from './account/account.module';
import { CoreModule }       from './core/core.module';

/* Routing Module */
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  imports: [
    BrowserModule,
    AccountModule,
    CoreModule,
    AppRoutingModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
