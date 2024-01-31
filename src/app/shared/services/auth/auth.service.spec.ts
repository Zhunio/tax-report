import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { SpectatorService, createServiceFactory } from '@ngneat/spectator';
import { Spy, provideAutoSpy } from 'jasmine-auto-spies';
import { SessionStorageService } from '../session-storage/session-storage.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let s: SpectatorService<AuthService>;
  let mockHttp: Spy<HttpClient>;
  let sessionStorage: SessionStorageService;

  const createService = createServiceFactory({
    service: AuthService,
    providers: [provideAutoSpy(HttpClient), SessionStorageService],
  });

  beforeEach(() => (s = createService()));

  beforeEach(() => {
    mockHttp = s.inject(HttpClient) as any;
    sessionStorage = s.inject(SessionStorageService);
  });

  describe('isAuthenticated()', () => {
    it('should return true when access_token is in session storage', () => {
      spyOn(sessionStorage, 'get').and.returnValue('abcde');

      expect(s.service.isAuthenticated()).toBeTrue();
    });
  });
  
  describe('getAuthToken()', () => {
    it('should return the access token when user is authenticated', () => {
      spyOn(sessionStorage, 'get').and.returnValue('abcde');

      expect(s.service.getAuthToken()).toEqual('abcde');
    });

    it('should return null when user is not authenticated', () => {
      spyOn(sessionStorage, 'get').and.returnValue(null);

      expect(s.service.getAuthToken()).toEqual(null);
    });
  });

  describe('register()', () => {
    it('should make `POST /register request`', () => {
      mockHttp.post.and.nextWith({});

      s.service.register({ username: 'john', password: 'abcde' }).subscribe();

      expect(mockHttp.post).toHaveBeenCalledWith(`${environment.baseUrl}/auth/register`, {
        username: 'john',
        password: 'abcde',
      });
    });

    it('should save access token in session storage when register is successful', () => {
      mockHttp.post.and.nextWith({ access_token: 'something' });

      s.service.register({ username: 'john', password: 'abcde' }).subscribe();

      expect(sessionStorage.get('access_token')).toEqual('something');
    });
  });

  describe('login()', () => {
    it('should make `POST /login request`', () => {
      mockHttp.post.and.nextWith({});

      s.service.login({ username: 'john', password: 'abcde' }).subscribe();

      expect(mockHttp.post).toHaveBeenCalledWith(`${environment.baseUrl}/auth/login`, {
        username: 'john',
        password: 'abcde',
      });
    });

    it('should save access token in session storage when login is successful', () => {
      mockHttp.post.and.nextWith({ access_token: 'something' });

      s.service.login({ username: 'john', password: 'abcde' }).subscribe();

      expect(sessionStorage.get('access_token')).toEqual('something');
    });
  });
});
