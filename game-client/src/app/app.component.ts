import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-title></app-title>
     <nav>
       <a routerLink="logon" routerLinkActive="active">Logon</a>
     </nav>
    <router-outlet></router-outlet>
  `
    //   <nav>
    //   <a routerLink="contact" routerLinkActive="active">Contact</a>
    //   <a routerLink="crisis"  routerLinkActive="active">Crisis Center</a>
    //   <a routerLink="heroes"  routerLinkActive="active">Heroes</a>
    // </nav>
})
export class AppComponent {
}

