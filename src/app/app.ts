import { Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <mat-toolbar color="primary">
      <span class="cursor-pointer" (click)="onTaxReportClicked()">Tax Report</span>
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
  imports: [MatToolbarModule, RouterModule],
})
export class AppComponent {
  router = inject(Router);

  onTaxReportClicked() {
    this.router.navigate(['/']);
  }
}
