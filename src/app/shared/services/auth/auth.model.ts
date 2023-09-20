export interface Login {
  username: string;
  password: string;
}

export interface Register {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
}
