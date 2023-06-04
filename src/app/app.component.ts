import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'inventery-app';

  isLoggedIn = true;
  showSubMenu: boolean = false;
constructor(public router:Router){

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
    // Clear user-related data or tokens
  
    // Navigate to the login page
    this.router.navigate(['/login']);
  }
  
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !event.url.includes('/login');
      }
    });
  }
  
}
