import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { KeySessionDataEnum, UserData } from "@core/interfaces/auth.interface";
import { AuthService } from "@core/services/auth.service";
import { NotificationsService } from "@shared/components/notifications/notifications.service";
import { from } from "rxjs";

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const notificationService = inject(NotificationsService);

  // Reading token and uid from localStorage (or sessionStorage if you prefer)
  // This assumes that the UserData interface contains idToken and uid properties
  const userData: UserData = authService.getSessionData(KeySessionDataEnum.UserData);
  if (!userData) {
    notificationService.showNotify({
      type: 'error',
      message: 'User not authenticated, redirecting to home page'
    });
    router.navigate(['']);
    return from([false]);
  }
  const idToken = userData.idToken;
  const uid = userData.uid;

  if (idToken && uid) {
    return from([true]);
  } else {
    notificationService.showNotify({
      type: 'error',
      message: 'User not authenticated, redirecting to home page'
    });
    router.navigate(['']);
    return from([false]);
  }
}