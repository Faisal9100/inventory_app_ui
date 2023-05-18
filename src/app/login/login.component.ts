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
  username?: string;
  password?: string;
  login() {
    // Perform the login logic
    // Assuming hardcoded username and password for demonstration purposes
    const hardcodedUsername = 'admin';
    const hardcodedPassword = '1234';

    if (this.username === hardcodedUsername && this.password === hardcodedPassword) {
      // Navigate to the sidebar component upon successful login
      this.router.navigate(['/sidebar']);
    } else {
      // Handle login error (e.g., display an error message)
    }
  }
//   userLogin(data:any){
// this.authService.login(this.loginData);
//   }

}
