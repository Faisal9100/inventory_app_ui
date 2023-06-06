import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private inject: Injector
  ) {}
  // constructor() {}
  token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2MDg4OTMxLCJqdGkiOiJhY2UxNTkxZTRiZTI0ODg4YjhlYzJjMWEzMTVhMzI0ZSIsInVzZXJfaWQiOjJ9.Hau6l8Y0qA6vW_xeDiDJ97IdBTbR5xF_pzltE9aeWvM';
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authService = this.inject.get(AuthService);
    let jwtToken = request.clone({
      setHeaders: {
        Authorization: 'JWT' + this.token,
      },
    });
    return next.handle(jwtToken);
  }
}
