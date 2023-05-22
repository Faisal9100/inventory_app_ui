// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor
// } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { AuthService } from './auth.service';
// import { Router } from '@angular/router';

// @Injectable()
// export class AuthInterceptorInterceptor implements HttpInterceptor {
  
//   constructor(private authService: AuthService, private router: Router) {}
//   // constructor() {}

//   intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
//       const token = this.authService.onLogIn(this.intercept);
//       if (token) {
//             request = request.clone({
//               setHeaders: {
//                 Authorization: `Bearer ${token}`
//               }
//             });
//           }
        
//     return next.handle(request);
//   }
// }

// // intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// //   // Clone the original request and add the authentication token to the headers
// //   if (token) {
// //     request = request.clone({
// //       setHeaders: {
// //         Authorization: `Bearer ${token}`
// //       }
// //     });
// //   }

//   // return next.handle(request);
// // }