import { Injectable } from '@angular/core';
import { SessionStorageKey, SessionStorageValue } from './session-storage.constant';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  constructor() {}

  set<Key extends SessionStorageKey, Value extends SessionStorageValue<Key>>(
    key: Key,
    value: Value
  ): void {
    sessionStorage.setItem(key, value);
  }

  get<Key extends SessionStorageKey, Value extends SessionStorageValue<Key>>(
    key: SessionStorageKey
  ): Value | null {
    const value = sessionStorage.getItem(key);

    if (typeof value === 'string') {
      return value as Value;
    }

    return value ? (JSON.parse(value) as Value) : null;
  }
}
