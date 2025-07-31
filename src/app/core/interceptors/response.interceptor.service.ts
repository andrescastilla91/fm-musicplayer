import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { environment } from '../../../environments/environment';


@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  /**
   * Intercept the response and handle errors
   * @param req HttpRequest
   * @param next HttpHandler
   * @returns Observable<HttpEvent<any>>
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        const errorResponse = error.error;
        return throwError(() => errorResponse);
      })
    );
  }
}
