import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../shared/services/auth/auth.service';
import { SessionStorageService } from '../shared/services/session-storage/session-storage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <!-- <div class="grid grid-cols-1 gap-3"> -->
    <!-- USERNAME -->
    <mat-form-field>
      <mat-label>Username</mat-label>
      <input type="text" matInput [(ngModel)]="username" placeholder="john" />
    </mat-form-field>

    <!-- PASSWORD -->
    <mat-form-field>
      <mat-label>Password</mat-label>
      <input type="password" matInput [(ngModel)]="password" placeholder="doe" />
    </mat-form-field>

    <!-- LOGIN -->
    <button
      [disabled]="!username || !password"
      mat-raised-button
      color="primary"
      class="flex-1"
      (click)="login()"
    >
      Login
    </button>
    <!-- </div> -->
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
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  providers: [AuthService, SessionStorageService]
})
export class LoginComponent {
  constructor(private readonly authService: AuthService) {}

  isLoading = false;

  username = '';
  password = '';

  login() {
    this.isLoading = true;

    this.authService.login({ username: this.username, password: this.password }).subscribe({
      next: () => {
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
