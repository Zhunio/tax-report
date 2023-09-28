export type SessionStorageMap = {
  access_token: string;
};

export type SessionStorageKey = keyof SessionStorageMap;
export type SessionStorageValue<Key extends SessionStorageKey> = SessionStorageMap[Key];
