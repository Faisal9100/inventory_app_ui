import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent {
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
}
