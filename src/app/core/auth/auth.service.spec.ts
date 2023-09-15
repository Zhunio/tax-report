import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { ObserverSpy } from '@hirez_io/observer-spy';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let s: SpectatorService<AuthService>;
  let mockHttp: Spy<HttpClient>;

  const createService = createServiceFactory({
    service: AuthService,
    providers: [provideAutoSpy(HttpClient)],
  });

  beforeEach(() => (s = createService()));

  beforeEach(() => {
    mockHttp = s.inject(HttpClient) as any;
  });

  describe('register', () => {
    it('should make `POST /register request`', () => {
      mockHttp.post.and.nextWith({});

      s.service.register({ username: 'john', password: 'abcde' }).subscribe();

      expect(mockHttp.post).toHaveBeenCalledWith(`${environment.baseUrl}/register`, {
        username: 'john',
        password: 'abcde',
      });
    });

    it('should save access token in session storage when register is successful', () => {
      mockHttp.post.and.nextWith({ access_token: 'something' });

      const observerSpy = new ObserverSpy();
      s.service.register({ username: 'john', password: 'abcde' }).subscribe(observerSpy);

      expect(observerSpy.getLastValue()).toEqual(sessionStorage.getItem('auth'));
    });

    it('should show error message when register fails');
  });

  describe('login()', () => {
    it('should make `POST /login request`', () => {});

    it('should save access token in session storage when login is successful');
    it('should show error message when login fails');
  });
});
