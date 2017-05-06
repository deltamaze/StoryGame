import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



import { NgModule }           from '@angular/core';
import { BrowserModule }      from '@angular/platform-browser';
/* App Root */
import { AppComponent }       from './app.component.3';


/* Routing Module */
import { AppRoutingModule }   from './app-routing.module.3';
@NgModule({
  imports:      [
    BrowserModule,
    ContactModule,
    AppRoutingModule
  ],
  providers:    [ UserService ],
  declarations: [ AppComponent, HighlightDirective, TitleComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
