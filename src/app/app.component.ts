import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `
    <mat-toolbar color="primary">
      <button mat-icon-button data-testid="tax-report-btn" (click)="goHome()">
        <mat-icon>home</mat-icon>
      </button>
      <span>Tax Report</span>

      <span class="space"></span>

      <button mat-icon-button data-testid="logout-btn" *ngIf="authService.isAuthenticated()" (click)="logout()">
        <mat-icon>logout</mat-icon>
      </button>
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
      .space {
        flex: 1 1 auto;
      }
    `,
  ],
  imports: [NgIf, MatToolbarModule, MatButtonModule, MatIconModule, RouterModule],
  providers: [AuthService],
})
export class AppComponent {
  router = inject(Router);
  authService = inject(AuthService);

  goHome() {
    this.router.navigate(['/']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
