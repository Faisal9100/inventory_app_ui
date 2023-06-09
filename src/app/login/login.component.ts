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
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(
    public basic: BasicService,
    private auth: AuthService,
    public router: Router
  ) {}
  invalidLogin: boolean = false;

  username?: string;
  password?: string;

  Login = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });
  responseData: any;


  ProceedLogin() {
    if (this.Login.valid) {
      this.auth.proceedLogin(this.Login.value).subscribe(
        (result) => {
          if (result != null) {
            this.responseData = result;
            localStorage.setItem('token', this.responseData.access);
            this.router.navigate(['/dashboard']);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Login Successsfully  ',
            });
          } else {
            // Password is incorrect, show validation error
            this.Login.controls['password'].setErrors({
              incorrectPassword: true,
            });

            // Show SweetAlert error message for incorrect password
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Incorrect password',
            });
          }
        },
        (error) => {
          // Show SweetAlert error message for unauthorized access
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unauthorized access',
          });
        }
      );
    }
  }

  hardcodedUsername = 'admin';
  hardcodedPassword = 'khan1234';

  isLoggedIn() {
    return localStorage.getItem('token') != null;
  }
}
