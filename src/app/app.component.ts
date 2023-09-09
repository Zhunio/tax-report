import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <mat-toolbar color="primary">
      <button mat-button (click)="goHome()">Tax Report</button>
    </mat-toolbar>
    <router-outlet></router-outlet>
  `,
  styles: [
    `
      :host {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-rows: auto auto 1fr;
      }
    `,
  ],
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
})
export class AppComponent {
  router = inject(Router);

  goHome() {
    this.router.navigate(['/']);
  }
}
