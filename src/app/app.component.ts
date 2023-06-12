import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LocalhostApiService } from './localhost-api.service';

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
  ) {}
  toggleSubMenu() {
    this.showSubMenu = !this.showSubMenu;
  }
  loginFormVisible: boolean = true;

  showLoginForm(): void {
    this.loginFormVisible = false;
  }
  showSidebar = true;
  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showSidebar = !event.url.includes('/login');
      }
     
    });
  }
//   dailySale: any[] = [];
//   monthlySale:any[]= [];
//   yearlySale:any[]=[];
//   dailyPurchase:any[]=[];
//   monthlyPurchase:any[]=[];
//   yearlyPurchase:any[]=[];
//  getDailySale() {
//     this.http
//       .get('http://127.0.0.1:8000/inventory/daily_sale/')
//       .subscribe((res: any) => {
//         this.dailySale = res.results;
//         console.log(res);
//       });
//   }
//  getMonthlySale() {
//     this.http
//       .get('http://127.0.0.1:8000/inventory/montly_sale/')
//       .subscribe((res: any) => {
//         this.monthlySale = res.results;
//         console.log(res);
//       });
//   }
//  getYearlySale() {
//     this.http
//       .get('http://127.0.0.1:8000/inventory/year_sale/')
//       .subscribe((res: any) => {
//         this.yearlySale = res.results;
//         console.log(res);
//       });
//   }
//  getDailyPurchase() {
//     this.http
//       .get('http://127.0.0.1:8000/inventory/daily_purchase/')
//       .subscribe((res: any) => {
//         this.dailyPurchase = res.results;
//         console.log(res);
//       });
//   }
//  getmonthlyPurchase() {
//     this.http
//       .get('http://127.0.0.1:8000/inventory/montly_purchase/')
//       .subscribe((res: any) => {
//         this.monthlyPurchase = res.results;
//         console.log(res);
//       });
//   }
//  getYearlyPurchase() {
//     this.http
//       .get('http://127.0.0.1:8000/inventory/year_purchase/')
//       .subscribe((res: any) => {
//         this.yearlyPurchase = res.results;
//         console.log(res);
//       });
//   }
}
