import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../services/auth.service';
import { KeySessionDataEnum, SessionSpotifyData } from '../interfaces/auth.interface';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private readonly authService: AuthService = inject(AuthService);

  /**
   * URLs that do not require a token
   */
  private readonly urlsWithoutToken: string[] = [
    'api/token',
  ];

  /**
   * Get token from local storage
   * @returns Token from local storage
   */
  private getAuthToken(): string {
    const sessionData: SessionSpotifyData = this.authService.getSessionData(KeySessionDataEnum.AuthToken);
    return sessionData?.access_token || '';
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.getAuthToken();
    
    if (this.urlsWithoutToken.some(url => req.url.endsWith(url))) {
      return next.handle(req);
    }

    if (authToken === '') {
      this.authService.logout(); 
      throw new Error('Token not found');
    }

    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    return next.handle(authReq);
  }

  
}
