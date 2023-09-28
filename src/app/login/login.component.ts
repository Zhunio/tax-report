import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';

import { AuthErrorLabel } from '../shared/services/auth/auth.enum';
import { AuthService } from '../shared/services/auth/auth.service';
import { NotificationService } from '../shared/services/notification/notification.service';
import { SessionStorageService } from '../shared/services/session-storage/session-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <!-- USERNAME -->
    <mat-form-field>
      <mat-label>Username</mat-label>
      <input type="text" matInput [(ngModel)]="username" placeholder="john" />
    </mat-form-field>

    <!-- PASSWORD -->
    <mat-form-field>
      <mat-label>Password</mat-label>
      <input
        type="password"
        matInput
        [(ngModel)]="password"
        placeholder="doe"
        (keyup.enter)="login()"
      />
    </mat-form-field>

    <!-- LOGIN -->
    <button
      [disabled]="!username || !password || isLoading"
      mat-raised-button
      color="primary"
      class="flex-1"
      (click)="login()"
    >
      <ng-container *ngIf="isLoading">Loading...</ng-container>
      <ng-container *ngIf="!isLoading">Login</ng-container>
    </button>
  `,
  styles: [
    `
      :host {
        @apply px-4 py-4 grid grid-cols-1 justify-items-center auto-rows-min gap-3;
      }

      mat-form-field,
      button {
        width: 400px;
      }
    `,
  ],
  providers: [AuthService, SessionStorageService, NotificationService],
  imports: [
    NgIf,
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
  ],
})
export class LoginComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly notificationService: NotificationService
  ) {}

  isLoading = false;

  username = '';
  password = '';

  login() {
    this.isLoading = true;

    this.authService
      .login({ username: this.username, password: this.password })
      .pipe(
        catchError(() => {
          console.error(AuthErrorLabel.CouldNotLogin);
          this.notificationService.openErrorMessage(AuthErrorLabel.CouldNotLogin);

          return of();
        }),
        tap(() => {
          this.isLoading = false;
          this.router.navigate(['/']);
        })
      )
      .subscribe();
  }
}
