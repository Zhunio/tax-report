import { AppComponent } from '@/app/app.component';
import { Router } from '@angular/router';
import { Spectator, byText, createComponentFactory } from '@ngneat/spectator';
import { provideAutoSpy } from 'jasmine-auto-spies';

describe('AppComponent', () => {
  let s: Spectator<AppComponent>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    providers: [provideAutoSpy(Router)],
  });

  beforeEach(() => (s = createComponent()));

  it('should create', async () => {
    expect(s.component).toBeDefined();
  });

  describe('goHome()', () => {
    it('should navigate to home when `Tax Report` button is clicked', async () => {
      s.click(byText('Tax Report'));

      const router = s.inject(Router);
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
