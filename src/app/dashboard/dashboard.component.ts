// import { ChartDataSets } from 'chart.js';
import {Chart,registerables} from 'node_modules/chart.js';
Chart.register(...registerables);
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';
// import { ChartDataSets, ChartOptions}from 'chart.js'
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
  constructor(public http: HttpClient, public api: LocalhostApiService) {
    this.getDailySale();
    this.getMonthlySale();
    this.get_Cash_In_Hand();
    this.getDailyPurchase();
    this.getmonthlyPurchase();
    this.get_All_Customer();
    this.get_Total_Expense();
    this.get_Yearly_Purchase();
    this.get_Yearly_sale();
  }

  // updateChartData() {
  //   // Initialize empty arrays to store the data
  //   const purchaseData = [];
  //   const saleData = [];
  //   const expenseData = [];

  //   // Loop through each expense object and extract the values
  //   for (const expense of this.total_Expense) {
  //     // purchaseData.push(expense.purchase);
  //     // saleData.push(expense.sale);
  //     expenseData.push(expense.expense);
  //   }

  //   // Update lineChartData with the extracted data
  //   this.lineChartData = [
  //     // { data: purchaseData, label: 'Purchase' },
  //     // { data: saleData, label: 'Sale' },
  //     { data: expenseData, label: 'Expense' },
  //   ];
  // }

  daily_Sale_amount: number = 0;
  getDailySale() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/daily_sale/')
      .subscribe((res) => {
        this.daily_Sale_amount = res.amount;
        // console.log(res);
      });
  }

  monthly_sale_amount: number = 0;
  getMonthlySale() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/montly_sale/')
      .subscribe((response) => {
        this.monthly_sale_amount = response.amount;
        // console.log(this.monthly_sale_amount);
      });
  }

  yearly_Sale_amount: number = 0;
  get_Cash_In_Hand() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/cashinhand/')
      .subscribe((res) => {
        this.yearly_Sale_amount = res.amount;
        // console.log(this.yearly_Sale_amount);
      });
  }

  daily_Purchase_amount: number = 0;
  getDailyPurchase() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/daily_purchase/')
      .subscribe((res) => {
        this.daily_Purchase_amount = res.amount;
        // console.log(this.daily_Purchase_amount);
      });
  }

  monthly_Purchase_amount: number = 0;
  getmonthlyPurchase() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/montly_purchase/')
      .subscribe((res) => {
        this.monthly_Purchase_amount = res.amount;
        // console.log(this.monthly_Purchase_amount);
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
  total_Expense: any[] = [];
  get_Total_Expense() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/year_expense/')
      .subscribe((res) => {
        this.total_Expense = res.results;
        console.log(res);
      });
    // this.updateChartData();
  }

  yearly_Sale: any[] = [];
  get_Yearly_sale() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/year_sale/')
      .subscribe((res) => {
        this.yearly_Sale = res.results;
        console.log(res);
      });
    // this.updateChartData();
  }
  yearly_Purchase: any[] = [];
  get_Yearly_Purchase() {
    this.http
      .get<any>('http://' + this.api.localhost + '/inventory/year_purchase/')
      .subscribe((res) => {
        this.yearly_Purchase = res.results;
        console.log(res);
      });
    // this.updateChartData();
  }




  // public lineChartData: any[] = [
  //   {
  //     data: [],
  //     label: 'Purchase',
  //   },
  //   {
  //     data: [],
  //     label: 'Sale',
  //   },
  //   {
  //     data: [],
  //     label: 'Expense',
  //   },
  // ];
  // public lineChartLabels = [
  //   'January',
  //   'February',
  //   'March',
  //   'April',
  //   'May',
  //   'June',
  //   'July',
  //   'August',
  //   'September',
  //   'October',
  //   'November',
  //   'December',
  // ];
  // public lineChartOptions = {
  //   responsive: true,
  // };
  // public lineChartLegend = true;
  // public lineChartType = 'line';
  addCharts() {
    let year_purchase: any = this.yearly_Purchase;
    let year_sale: any = this.yearly_Sale;
    let year_expense: any = this.total_Expense;
    var myChart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: [
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
        ],
        datasets: [
          {
            label: 'Purchase',
            data: year_purchase,
            backgroundColor: '#fd95654d',
            borderColor: '#fd9465',
            borderWidth: 1,
          },
          {
            label: 'Sale',
            data: year_sale,
            backgroundColor: '#00c3825b',
            borderColor: '#00c382',
            borderWidth: 1,
          },
          {
            label: 'Expense',
            data: year_expense,
            backgroundColor: '#fc60723b',
            borderColor: '#fc6071',
            borderWidth: 1,
          },
        ],
      },
      options: {
        elements: {
          bar: {
            borderWidth: 0,
          },
        },
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Stock Purchase and Sale Statistics',
          },
        },
      },
    });}
  }
  // updateChartData() {
  //   if (
  //     this.total_Expense.length === 0 ||
  //     this.yearly_Sale.length === 0 ||
  //     this.yearly_Purchase.length === 0
  //   ) {
  //     return;
  //   }

  //   const expenseData = this.total_Expense.map((expense) => expense.results);
  //   const saleData = this.yearly_Sale.map((sale) => sale.results);
  //   const purchaseData = this.yearly_Purchase.map(
  //     (purchase) => purchase.results
  //   );

  //   this.lineChartData = [
  //     { data: expenseData, label: 'Total Expense' },
  //     { data: saleData, label: 'Yearly Sale' },
  //     { data: purchaseData, label: 'Yearly Purchase' },
  //   ];
  // }
