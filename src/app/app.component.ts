import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'inventery-app';

  isLoggedIn = true;
  showSubMenu: boolean = false;

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }
  loginFormVisible: boolean = true;

  showLoginForm(): void {
    this.loginFormVisible = false;
  }
}
