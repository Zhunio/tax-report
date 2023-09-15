import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthResponse, Login, Register } from './auth.model';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly http: HttpClient) {}

  register(register: Register) {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/register`, register).pipe(
      tap(({ access_token }) => sessionStorage.setItem('auth', access_token))
    )
  }

  login(login: Login) {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/login`, login);
  }

  private saveAccessTokenInSessionStorage() {
    
  }
}
