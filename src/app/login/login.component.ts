import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router,private http: HttpClient) { }
  
  f:any;
  error?: string;
  invalidLogin: boolean = false;
  showLoginForm = true;
  // loginData = { username: '', password: '' };
  userLogin(data:any): void {
    this.authService.signIn(data);
    console.log(data)
  }
//   userLogin(data:any){
// this.authService.login(this.loginData);
//   }

}
