import { TestBed } from '@angular/core/testing';

import { SessionStorageService } from './session-storage.service';

describe('SessionStorageService', () => {
  let service: SessionStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [SessionStorageService] });
    service = TestBed.inject(SessionStorageService);
  });

  beforeEach(() => sessionStorage.clear());

  it('should set key in session storage', () => {
    service.set('access_token', 'abcdef');

    expect(sessionStorage.getItem('access_token')).toEqual('abcdef');
  });

  it('should get key from session storage when key does not exist', () => {
    expect(service.get('access_token')).toEqual(null);
  });

  it('should get key from session storage when key exists', () => {
    service.set('access_token', 'abcdef');

    expect(service.get('access_token')).toEqual('abcdef');
  });
});
