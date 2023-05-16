import { LoginComponent } from './login/login.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private apiUrl = 'http://192.168.1.9:8000/auth/jwt/create/';
  loginFormVisible: boolean=true;

  constructor(private http: HttpClient, private router: Router) {}


  signIn(loginData: { username: string; password: string }): void {
    this.http
      .post(this.apiUrl, loginData)
      .subscribe((result: any) => {
        localStorage.setItem('token', result.access);
        this.loginFormVisible = false;
        this.router.navigate(['/dashboard']);
        // console.warn(result); 
      });
  }
  isAuthenticated(): boolean {
    // Implement your authentication logic here
    // Example: check if a token is present in local storage
    const token = localStorage.getItem('token');
    return !!token; // Return true if the token exists, false otherwise
  }
}
