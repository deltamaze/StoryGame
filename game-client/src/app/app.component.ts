import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div class="narrowcontainer">
    <app-title></app-title>
     
    <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['./app.component.css']
    //   <nav>
    //   <a routerLink="contact" routerLinkActive="active">Contact</a>
    //   <a routerLink="crisis"  routerLinkActive="active">Crisis Center</a>
    //   <a routerLink="heroes"  routerLinkActive="active">Heroes</a>
    // </nav>
})
export class AppComponent {
}

