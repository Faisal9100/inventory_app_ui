import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(public http: HttpClient, public api: LocalhostApiService) {
    // this.getDailySale();
    this.getMonthlySale();
    // this.getYearlySale();
    // this.getDailyPurchase();
    // this.getmonthlyPurchase();
    // this.getYearlyPurchase();
  }
  public lineChartData = [
    {
      data: [65, 59, 80, 81, 56, 55, 40, 30, 20, 40, 70, 89],
      label: 'Total Purchase',
    },
    {
      data: [28, 48, 40, 19, 86, 27, 90, 15, 36, 58, 69, 78],
      label: 'Total Purchase Return',
    },
    {
      data: [25, 58, 20, 29, 66, 47, 80, 54, 23, 12, 54, 56],
      label: 'Total Sale',
    },
    {
      data: [23, 88, 60, 39, 26, 67, 70, 56, 73, 87, 34, 35],
      label: 'Total Sale Return',
    },
  ];
  public lineChartLabels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  public lineChartOptions = {
    responsive: true,
  };
  public lineChartLegend = true;
  public lineChartType = 'line';
  dailySale: any[] = [];
  monthlySale: any[] = [];
  yearlySale: any[] = [];
  dailyPurchase: any[] = [];
  monthlyPurchase: any[] = [];
  yearlyPurchase: any[] = [];
  // getDailySale() {
  //   this.http
  //     .get('http://127.0.0.1:8000/inventory/daily_sale/')
  //     .subscribe((res: any) => {
  //       this.dailySale = res.results;
  //       console.log(res);
  //     });
  // }
  getMonthlySale() {
    this.http
      .get('http://127.0.0.1:8000/inventory/montly_sale/')
      .subscribe((res: any) => {
        this.monthlySale = res.results;
        console.log(res);
      });
  }
  // getYearlySale() {
  //   this.http
  //     .get('http://127.0.0.1:8000/inventory/year_sale/')
  //     .subscribe((res: any) => {
  //       this.yearlySale = res.results;
  //       console.log(res);
  //     });
  // }
  // getDailyPurchase() {
  //   this.http
  //     .get('http://127.0.0.1:8000/inventory/daily_purchase/')
  //     .subscribe((res: any) => {
  //       this.dailyPurchase = res.results;
  //       console.log(res);
  //     });
  // }
  // getmonthlyPurchase() {
  //   this.http
  //     .get('http://127.0.0.1:8000/inventory/montly_purchase/')
  //     .subscribe((res: any) => {
  //       this.monthlyPurchase = res.results;
  //       console.log(res);
  //     });
  // }
  // getYearlyPurchase() {
  //   this.http
  //     .get('http://127.0.0.1:8000/inventory/year_purchase/')
  //     .subscribe((res: any) => {
  //       this.yearlyPurchase = res.results;
  //       console.log(res);
  //     });
  // }
}
