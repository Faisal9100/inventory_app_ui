// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
//   HttpResponse
// } from '@angular/common/http';
// import { Observable, tap } from 'rxjs';
// import { AuthService } from './auth.service';
// import { Router } from '@angular/router';

// @Injectable()
// export class AuthInterceptorInterceptor implements HttpInterceptor {
  
//   constructor(private authService: AuthService, private router: Router) {}
//   // constructor() {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem('token');
//     const authRequest = request.clone({
//       setHeaders: {
//         Authorization: `JWT ${token}`
//       }
//     });
  
//     return next.handle(authRequest).pipe(
//       tap(
//         (event: HttpEvent<any>) => {
//           if (event instanceof HttpResponse) {
//             // Handle successful response
//             console.log('Response:', event);
//           }
//         },
//         (error: any) => {
//           // Handle error response
//           console.error('Error:', error);
//         }
//       )
//     );
//   }
  

// intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//   // Clone the original request and add the authentication token to the headers
//   if (token) {
//     request = request.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//   }

//   return next.handle(request);
// }
// }