import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';
// import { BasicService } from './../../services/basic.service';

import {
  UntypedFormGroup,
  UntypedFormControl,
  Validators,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { BasicService } from '../basic.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent  {
  // constructor(
  //   private authService: AuthService,
  //   private router: Router,
  //   private http: HttpClient
  // ) {}
  // username?: string;
  // password?: string;
  // login() {
  //   // Perform the login logic
  //   // Assuming hardcoded username and password for demonstration purposes
  //   const hardcodedUsername = 'admin';
  //   const hardcodedPassword = '1234';

  //   if (this.username === hardcodedUsername && this.password === hardcodedPassword) {
  //     // Navigate to the sidebar component upon successful login
  //     this.router.navigate(['/sidebar']);
  //   } else {
  //     // Handle login error (e.g., display an error message)
  //   }
  // }
  //   userLogin(data:any){
  // this.authService.login(this.loginData);
  //   }
  // ngOnInit(): void {
  //   const localData = localStorage.getItem('signUpUsers');
  //   if (localData != null) {
  //     this.signupUsers = JSON.parse(localData);
  //   }
  // }
  // signupUsers: any[] = [];
  // signupObj: any = {
  //   userName: '',
  //   email: '',
  //   password: '',
  // };
  // loginObj: any = {
  //   username: '',
  //   password: '',
  // };
  // onSignUp() {
  //   this.signupUsers.push(this.signupObj);
  //   localStorage.setItem('signUpUsers', JSON.stringify(this.signupUsers));
  //   this.signupObj = {
  //     username: '',
  //     email: '',
  //     password: '',
  //   };
  // }
  // onLogIn() {
  //   this.authService.onLogIn(this.loginObj).subscribe((res) => {
  //     console.log(res);
  //     localStorage.setItem('token', res.access);
  //     this.router.navigateByUrl('/dashboard');
  //   });
  // }
  constructor(public basic: BasicService, private auth: AuthService) {}
  loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  form = new UntypedFormGroup({
    username: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required]),
  });
  get username() {
    return this.form.get('username');
  }
  get password() {
    return this.form.get('password');
  }

  loginError: boolean = false;
  login() {
    if (this.form.valid) {
      this.loginError = false;
      this.loader.next(true);
      let data = new FormData();
      data.append('username', this.username?.value);
      data.append('password', this.password?.value);
      this.auth
        .login(data)
        .then((res) => {
          this.loader.next(false);
        })
        .catch((error) => {
          if (error.status === 401) this.loginError = true;
          this.loader.next(false);
        });
    }
  }

  // ----------------------- Reset Password -----------------------
  resetForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  get email() {
    return this.resetForm.get('email');
  }

  reset_loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  resetPassword() {
    if (this.email?.invalid) {
      document.getElementById('email')?.focus();
    } else {
      if (!this.reset_loader.value) {
        Promise.resolve().then((res) => this.reset_loader.next(true));
        let data = new FormData();
        data.append('email', <any>this.email?.value);
        this.auth
          .sendResetPassword(data)
          .then((res) => {
            setTimeout((res: any) => {
              this.reset_loader.next(false);
              document.getElementById('resetPasswordModelCloseButton')?.click();
              this.email?.reset();
            }, 100);
          })
          .catch((error) => setTimeout(() => this.reset_loader.next(false), 0));
      }
    }
  }
}
