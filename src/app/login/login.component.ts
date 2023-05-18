import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
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
  ngOnInit(): void {
    const localData = localStorage.getItem('signUpUsers');
    if (localData != null) {
      this.signupUsers = JSON.parse(localData);
    }
  }
  signupUsers: any[] = [];
  signupObj: any = {
    userName: '',
    email: '',
    password: '',
  };
  loginObj: any = {
    username: '',
    password: '',
  };
  onSignUp() {
    this.signupUsers.push(this.signupObj);
    localStorage.setItem('signUpUsers', JSON.stringify(this.signupUsers));
    this.signupObj = {
      username: '',
      email: '',
      password: '',
    };
  }
  onLogIn() {
    this.authService.onLogIn(this.loginObj).subscribe((res) => {
      console.log(res);
      localStorage.setItem('token', res.access);
      this.router.navigateByUrl('/dashboard');
    });
  }
}
