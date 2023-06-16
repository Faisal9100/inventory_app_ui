import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalhostApiService } from './localhost-api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'inventery-app';

  isLoggedIn = true;
  showSubMenu: boolean = false;
  constructor(
    public router: Router,
    public auth: AuthService,
    public api: LocalhostApiService,
    public http: HttpClient
  ) {
    this.getUser();
  }
  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }
  loginFormVisible: boolean = true;

  showLoginForm(): void {
    this.loginFormVisible = false;
  }
  showSidebar = true;
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.logout();
        this.router.navigateByUrl('/login');
        Swal.fire({
          icon: 'success',
          title: 'Logged Out Successfully',
          text: 'You have been logged out.',
        });
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !event.url.includes('/login');
      }
    });
    // this.getUser();
  }
  user: any; // variable to store the user information
  isActive: boolean = false;

  users: any = {};
  getUser(): void {
    this.http.get(this.api.localhost + '/auth/users/me/').subscribe(
      (response) => {
        this.users = response;
        // console.log(this.users);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

}
