import {
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { exhaustMap, Observable, take } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return this.authService.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (user != null && user._token != null) {
          const modifiedReq = req.clone({
            headers: new HttpHeaders({
              Authorization: 'Bearer ' + user._token,
            }),
          });
          return next.handle(modifiedReq);
          // return next.handle(req);
        }
        return next.handle(req);
      }),
    );
  }
}
