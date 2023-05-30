import { LoginComponent } from './login/login.component';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import Notify from 'simple-notify';
import { BehaviorSubject } from 'rxjs';
import { BasicService } from './basic.service';

import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private tokenKey = 'auth_token';
  private apiUrl = 'http://192.168.1.9:8000/inventory/auth/jwt/create/';
  loginFormVisible: boolean = true;

  constructor(
    private basic: BasicService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  get isLoggin() {
    let JWT = new JwtHelperService();
    let token: any = localStorage.getItem('token');
    let isExpired = JWT.isTokenExpired(token);
    return !isExpired;
  }
  get decode() {
    let JWT = new JwtHelperService();
    let token: any = localStorage.getItem('token');
    let decode = JWT.decodeToken(token);
    return decode;
  }
  get Header() {
    let token: any = localStorage.getItem('token');
    let headers = new HttpHeaders().set('Authorization', 'JWT ' + token);
    return headers;
  }
  currentUser: any;
  permissions: any = {};
  isPermissions: boolean = true;
  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      this.http
        .get(this.basic.auth + 'users/me/', { headers: this.Header })
        .subscribe(
          (res) => {
            this.currentUser = res;
            this.basic.refresh = false;
            resolve(res);
          },
          (error) => {
            reject(error);
            this.basic.refresh = false;
            if (error.status === 401) {
              // this.basic.unauthorized = true;
            } else this.basic.handleError(error, 'Current User');
          }
        );
    });
  }

  patchCurrentUser(data: any) {
    return new Promise((resolve, reject) => {
      this.http
        .patch(this.basic.auth + 'users/me/', data, {
          headers: this.Header,
        })
        .subscribe(
          (res) => resolve(res),
          (error) => {
            reject(error);
            this.basic.handleError(error, 'Patching Data of Current User');
          }
        );
    });
  }

  changeUsername(data: FormData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.basic.auth + 'users/set_username/', data, {
          headers: this.Header,
        })
        .subscribe(
          (res) => resolve(res),
          (error) => {
            reject(error);
            this.basic.handleError(error, 'Changing Username of Current User');
          }
        );
    });
  }

  changePassword(data: FormData) {
    return new Promise((resolve, reject) => {
      this.http
        .post(this.basic.auth + 'users/set_password/', data, {
          headers: this.Header,
        })
        .subscribe(
          (res) => resolve(res),
          (error) => {
            reject(error);
            this.basic.handleError(error, 'Changing Password of Current User');
          }
        );
    });
  }

  sendResetPassword(data: FormData) {
    return new Promise((resolve, reject) => {
      this.http.post(this.basic.auth + 'users/reset_password/', data).subscribe(
        (res) => {
          resolve(res);
          new Notify({
            status: 'success',
            text: 'Reset link send to your email',
            effect: 'slide',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            gap: 20,
            distance: 20,
            type: 3,
            position: 'right top',
          });
        },
        (error) => {
          reject(error);
          new Notify({
            status: 'error',
            text: 'Something wrong when sending reset link email',
            effect: 'slide',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            gap: 20,
            distance: 20,
            type: 3,
            position: 'right top',
          });
        }
      );
    });
  }

  // ---------------------------------------------------------------------------- Data Section ----------------------------------------------------------------------------
  // ---------------------------------------------------------------------------- Data Section ----------------------------------------------------------------------------

  login(data: any) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiUrl, data).subscribe(
        (res) => {
          let response: any = res;
          let JWT = new JwtHelperService();
          let decode = JWT.decodeToken(response.access);
          if (decode.is_staff) {
            resolve(res);
            if (response.access) {
              let token: any = response.access;
              localStorage.setItem('token', token);
              let returnUrl =
                this.route.snapshot.queryParamMap.get('returnUrl');
              this.router.navigate(['/dashboard']);
              this.basic.addAlert(1, 'Login Successfully');
              this.getCurrentUser();
            }
          } else reject('error');
        },
        (error) => {
          reject(error);
          if (error.status != 401)
            this.basic.handleError(error, 'Performing Login');
        }
      );
    });
  }

  logout() {
    Swal.fire({
      icon: 'question',
      text: 'Do you want to logout?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}
