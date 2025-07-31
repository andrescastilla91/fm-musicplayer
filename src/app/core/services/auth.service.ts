import { inject, Injectable } from "@angular/core";
import { AuthSessionSpotify, KeySessionDataEnum, SessionSpotifyData } from "../interfaces/auth.interface";
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, User } from "@angular/fire/auth";
import { from, map, Observable, of } from "rxjs";
import { environment } from "@environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly oauth = inject(Auth);
  private readonly http = inject(HttpClient);

  /**
   * Login with Google
   * This method uses Firebase Authentication to sign in with Google.
   * @returns User object if authenticated with Google, otherwise null
   */
  public loginWithGoogle(): Observable<User> {
    return from(signInWithPopup(this.oauth, new GoogleAuthProvider()).then(res => res.user));
  }

  /**
   * Login to Spotify using client credentials
   * This method retrieves an access token from Spotify's API using client credentials.
   * @returns Observable<AuthSessionSpotify>
   */
  public loginSpotify(): Observable<AuthSessionSpotify> {
    const url = environment.apiAuthSpotify;
    const body = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: environment.spotifyConfig.clientId,
      client_secret: environment.spotifyConfig.secret
    }).toString();
    return this.http.post<AuthSessionSpotify>(url, body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  }

  /**
   * Get a valid Spotify token from session storage
   * This method checks if the token is valid and returns it, otherwise it logs in to Spotify.
   * @returns Observable<string>
   */
  public getValidSpotifyToken(): Observable<string> {
    const tokenData: SessionSpotifyData = this.getSessionData(KeySessionDataEnum.AuthToken);
    const now = Date.now();
    if (tokenData?.access_token && tokenData?.expires_at && now < tokenData.expires_at) {
      return of(tokenData.access_token);
    }

    // If the token is not valid, try to login to Spotify
    // This will trigger the login flow and store the token in session storage
    return this.loginSpotify().pipe(
      map(res => {
        const expires_at = Date.now() + (res.expires_in * 1000) - 5000;
        const tokenData = { ...res, expires_at };
        this.setSessionData(KeySessionDataEnum.AuthToken, JSON.stringify(tokenData));
        return res.access_token;
      })
    );
  }

  /**
   * Logout from firebase and clear session data
   * This method clears all session data related to authentication.
   * @returns Observable<void>
   */
  public logout(): Observable<void> {
    for (const key of Object.values(KeySessionDataEnum)) {
      localStorage.removeItem(key);
    }
    return from(signOut(this.oauth));
  }

  /**
   * Set session data in local storage
   * @param key - The key under which the data is stored
   * @param value - The value to be stored
   * @returns {void}
   */
  public setSessionData(key: KeySessionDataEnum, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Get session data from local storage
   * @param key - The key under which the data is stored
   * @returns Parsed session data or null if not found
   */
  public getSessionData(key: KeySessionDataEnum) {
    try {
      const data = localStorage.getItem(key);
      if (!data) return null;

      let parsedData: any;
      try {
        parsedData = JSON.parse(data);
      } catch {
        parsedData = data;
      }
      return parsedData;
    } catch (error) {
      console.error('Error accessing session data:', error);
      return null;
    }
  }

}