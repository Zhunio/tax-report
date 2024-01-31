import { HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const authService = inject(AuthService);

  if (authService.isAuthenticated()) {
    const authorization = 'Bearer ' + authService.getAuthToken()!;
    req = req.clone({ setHeaders: { authorization } });
  }

  return next(req);
}
