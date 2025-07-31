export enum KeySessionDataEnum {
  AuthToken = 'authToken',
  UserData = 'userData',
}

export interface AuthSessionSpotify {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface SessionSpotifyData {
  access_token: string;
  expires_in: number;
  expires_at: number;
}

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  idToken?: string;
}

export type KeySessionData = keyof typeof KeySessionDataEnum;