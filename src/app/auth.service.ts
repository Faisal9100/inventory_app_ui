import { LoginComponent } from './login/login.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { BasicService } from './basic.service';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LocalhostApiService } from './localhost-api.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private apiUrl = this.api.localhost + '/auth/jwt/create/';
  loginFormVisible: boolean = true;

  constructor(
    private basic: BasicService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    public api: LocalhostApiService
  ) {}
  makeHttpRequestWithHeaders() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'JWT <access>',
    });
  }

  login(credentials: any): Observable<boolean> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `JWT ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };

    return this.http
      .post<any>(this.apiUrl, JSON.stringify(credentials), httpOptions)
      .pipe(
        map((response: any) => {
          let result = response;
          if (result && result.access) {
            localStorage.setItem('token', result.access);
            return true;
          }
          return false;
        })
      );
  }
  logout(): void {
    localStorage.removeItem('token');
  }

  proceedLogin(credentials: any) {
    return this.http.post(this.apiUrl, credentials);
  }
  getToken() {
    return localStorage.getItem('token') || '';
  }
  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }
}
