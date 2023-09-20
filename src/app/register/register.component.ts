import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../shared/services/auth/auth.service';
import { SessionStorageService } from '../shared/services/session-storage/session-storage.service';

@Component({
  selector: 'app-register',
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
      <input type="password" matInput [(ngModel)]="password" placeholder="doe" />
    </mat-form-field>

    <!-- REGISTER -->
    <button
      [disabled]="!username || !password"
      mat-raised-button
      color="primary"
      class="flex-1"
      (click)="register()"
    >
      Register
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
  imports: [FormsModule, MatFormFieldModule, MatButtonModule, MatInputModule],
  providers: [AuthService, SessionStorageService],
})
export class RegisterComponent {
  constructor(private readonly authService: AuthService) {}

  isLoading = false;

  username = '';
  password = '';

  register() {
    this.isLoading = true;

    this.authService.register({ username: this.username, password: this.password }).subscribe({
      next: () => this.isLoading = false,
      error: () => this.isLoading = false
    })
  }
}
