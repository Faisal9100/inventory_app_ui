import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  showSubMenu: boolean = false;

  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
    
  }
  loginFormVisible: boolean = true;
  
  showLoginForm(): void {
    this.loginFormVisible = false;
  }
  login:boolean = false;
}
