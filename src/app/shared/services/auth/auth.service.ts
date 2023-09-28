import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { AuthResponse, Login, Register } from './auth.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpClient,
    private readonly sessionStorage: SessionStorageService
  ) {}

  register(register: Register) {
    return this.http
      .post<AuthResponse>(`${environment.baseUrl}/auth/register`, register)
      .pipe(tap(({ access_token }) => this.sessionStorage.set('access_token', access_token)));
  }

  login(login: Login) {
    return this.http
      .post<AuthResponse>(`${environment.baseUrl}/auth/login`, login)
      .pipe(tap(({ access_token }) => this.sessionStorage.set('access_token', access_token)));
  }
}
