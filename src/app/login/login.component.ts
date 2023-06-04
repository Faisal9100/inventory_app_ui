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
  invalidLogin:boolean=false;
  // signIn(credentials: any) {
  //   this.auth.login(credentials).subscribe((result: boolean) => {
  //     console.log(result);
  //     if (result) {
  //       this.router.navigate(['/']);
  //     } else {
  //       this.invalidLogin = true;
  //     }
  //   });
  // }
  username?:string;
  password?:string;
isLoggedIn :boolean= false; 
  login() {
    const hardcodedUsername = 'admin';
    const hardcodedPassword = '1234';
  
    if (this.username === hardcodedUsername && this.password === hardcodedPassword) {
      console.log('Login successful');
      this.isLoggedIn = true; 
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Login Successfully',
      });
      // Perform any additional actions for successful login
  
      // Navigate to the dashboard
      this.router.navigate(['/dashboard']);
    } else {
      console.log('Invalid username or password');
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Invalid username or password',
      });
      // Perform any additional actions for unsuccessful login
    }
  }
  
  
  }
