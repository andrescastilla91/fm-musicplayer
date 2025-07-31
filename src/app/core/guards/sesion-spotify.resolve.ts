import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { KeySessionDataEnum } from "@core/interfaces/auth.interface";
import { AuthService } from "@core/services/auth.service";
import { NotificationsService } from "@shared/components/notifications/notifications.service";
import { catchError, map, Observable, of } from "rxjs";

export const SessionSpotifyResolve: ResolveFn<boolean> = (route, state): Observable<boolean> => {
  
  const authService = inject(AuthService);
  const notificationService = inject(NotificationsService);

  const hasValidToken = authService.getValidSpotifyToken();

  // Check if the token is valid
  if (hasValidToken) {
    return of(true);
  }

  // If the token is not valid, try to login to Spotify
  // This will trigger the login flow and store the token in session storage
  return authService.loginSpotify().pipe(
    map((response) => {
      const tokenData = {
        access_token: response.access_token,
        expires_in: response.expires_in,
        expires_at: Date.now() + (response.expires_in * 1000) - 5000
      };
      authService.setSessionData(KeySessionDataEnum.AuthToken, JSON.stringify(tokenData));
      return true;
    }),
    catchError(() => {
      notificationService.showNotify({
        type: 'error',
        message: 'Error logging in to Spotify. Please try again later.'
      })
      return [false];
    })
  );
}