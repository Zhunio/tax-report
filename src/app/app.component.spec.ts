import { AppComponent } from '@/app/app.component';
import { Router } from '@angular/router';
import { Spectator, byTestId, createComponentFactory } from '@ngneat/spectator';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';
import { AuthService } from './shared/services/auth/auth.service';

describe('AppComponent', () => {
  let s: Spectator<AppComponent>;
  let authService: Spy<AuthService>;
  let router: Spy<Router>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    providers: [provideAutoSpy(Router)],
  });

  beforeEach(() => {
    s = createComponent({
      providers: [provideAutoSpy(AuthService)],
    });

    router = s.inject(Router) as any;
    authService = s.inject(AuthService) as any;
  });

  it('should create', async () => {
    expect(s.component).toBeDefined();
  });

  describe('goHome()', () => {
    it('should navigate to home when `Tax Report` button is clicked', async () => {
      s.click(byTestId('tax-report-btn'));

      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('logout()', () => {
    it('should show logout button if user is authenticated', async () => {
      authService.isAuthenticated.and.returnValue(true);
      s.detectChanges();

      expect(s.query(byTestId('logout-btn'))).toBeVisible();
    });

    it('should hide logout button if user is not authenticated', async () => {
      authService.isAuthenticated.and.returnValue(false);
      s.detectChanges();

      expect(s.query(byTestId('logout-btn'))).toBeHidden();
    });

    it('should perform logout logic', async () => {
      authService.isAuthenticated.and.returnValue(true);
      s.detectChanges();
      
      s.click(byTestId('logout-btn'));

      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
