import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SessionStorageService } from '../session-storage/session-storage.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const router = inject(Router);
  const sessionStorage = inject(SessionStorageService);

  const accessToken = sessionStorage.get('access_token');
  if (accessToken) {
    return true;
  }

  return router.navigate(['/login']);
};
