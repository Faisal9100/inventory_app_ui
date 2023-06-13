import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(public http: HttpClient, public api: LocalhostApiService) {
    this.getDailySale();
    this.getMonthlySale();
    this.get_Cash_In_Hand();
    this.getDailyPurchase();
    this.getmonthlyPurchase();
    this.get_All_Customer();
    this.get_Total_Expense();
    this.get_Yearly_Purchase();
  }
  ngOnInit(): void {
    this.get_Yearly_sale();
  }
  daily_Sale_amount: number = 0;
  getDailySale() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/daily_sale/')
      .subscribe((res) => {
        this.daily_Sale_amount = res.amount;
      });
  }

  monthly_sale_amount: number = 0;
  getMonthlySale() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/montly_sale/')
      .subscribe((response) => {
        this.monthly_sale_amount = response.amount;
      });
  }

  yearly_Sale_amount: number = 0;
  get_Cash_In_Hand() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/cashinhand/')
      .subscribe((res) => {
        this.yearly_Sale_amount = res.amount;
      });
  }

  daily_Purchase_amount: number = 0;
  getDailyPurchase() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/daily_purchase/')
      .subscribe((res) => {
        this.daily_Purchase_amount = res.amount;
      });
  }

  monthly_Purchase_amount: number = 0;
  getmonthlyPurchase() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/montly_purchase/')
      .subscribe((res) => {
        this.monthly_Purchase_amount = res.amount;
      });
  }
  all_Customer: number = 0;
  get_All_Customer() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/customer_count/')
      .subscribe((res) => {
        this.all_Customer = res.count;
      });
  }
  total_Expense: { [month: string]: number } = {};
  get_Total_Expense() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/year_expense/')
      .subscribe((res) => {
        this.total_Expense = res;
        console.log(this.total_Expense);
        this.addCharts(
          this.yearly_Purchase,
          this.yearly_Sale,
          this.total_Expense
        );
      });
  }

  yearly_Purchase: { [month: string]: number } = {};
  get_Yearly_Purchase() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/year_purchase/')
      .subscribe((res) => {
        this.yearly_Purchase = res;
        this.addCharts(
          this.yearly_Purchase,
          this.yearly_Sale,
          this.total_Expense
        );
      });
  }

  yearly_Sale: { [month: string]: number } = {};
  get_Yearly_sale() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/year_sale/')
      .subscribe((res) => {
        this.yearly_Sale = res;
        this.addCharts(
          this.yearly_Purchase,
          this.yearly_Sale,
          this.total_Expense
        );
      });
  }

  addCharts(
    purchaseData: { [month: string]: number },
    saleData: { [month: string]: number },
    expenseData: { [month: string]: number }
  ): void {
    const canvas = <HTMLCanvasElement>document.getElementById('chart');
    const context = canvas.getContext('2d');

    if (context) {
      if (this.chart) {
        this.chart.destroy();
      }

      const purchaseChartData = Object.values(purchaseData);
      const saleChartData = Object.values(saleData);
      const expenseChartData = Object.values(expenseData);

      this.chart = new Chart(context, {
        type: 'bar',
        data: {
          labels: Object.keys(purchaseData),
          datasets: [
            {
              label: 'Purchase',
              data: purchaseChartData,
              borderWidth: 1,
            },
            {
              label: 'Sale',
              data: saleChartData,
              borderWidth: 1,
            },
            {
              label: 'Expense',
              data: expenseChartData,
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }

  chart: any;
  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
