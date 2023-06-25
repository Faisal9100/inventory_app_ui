import { Component } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';
import { HttpClient } from '@angular/common/http';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.css'],
})
export class BalancesheetComponent {
  constructor(public api: LocalhostApiService, public http: HttpClient) {
    this.getBalanceSheet();
    this.getProfitLoss();
  }
  public url = this.api.localhost + '/inventory/balancesheet/';
  public url2 = this.api.localhost + '/inventory/profitloss/';

  // <========================================== CODE FOR BALANCE SHEET =======================================>

  balanceSheet: any = {};
  getBalanceSheet() {
    this.http.get(this.url).subscribe((res) => {
      this.balanceSheet = Object.entries(res);
      // console.log(this.balanceSheet);
      this.calculateBalances();
    });
  }

  // <====================================== CODE FOR GETTING PROFIT & LOSS ======================================>

  profit: any = {};
  getProfitLoss() {
    this.http.get(this.url2).subscribe((res: any) => {
      this.profit = res;
      // console.log(this.profit);
      this.calculateBalances();
    });
  }

  // <===================================== CODE FOR CALCULATING ACCOUNTS BALANCE =================================>

  totalLeftBalance: number = 0;
  totalRightBalance: number = 0;
  totalrightbalance: any;
  calculateBalances() {
    this.totalLeftBalance = 0;
    this.totalRightBalance = 0;

    // Calculate total balance of current accounts on the left side
    for (let [key, value] of this.balanceSheet) {
      if (value.main_layer === 'Assets') {
        this.totalLeftBalance += value.balance;
      }
      if (value.main_layer === 'laibility' || value.main_layer === 'Equity') {
        this.totalRightBalance += value.balance;
      }
    }

    const netIncome = this.profit?.['net_income'] || 0;
    this.totalrightbalance = this.totalRightBalance + netIncome;
  }
  // <============================================== CODE FOR PDF ===============================================>

  generatePDF() {
    const pdfElement = document.getElementById('pdf-content');

    if (pdfElement) {
      const options = {
        scale: 5, // Increase scale factor for higher resolution
        dpi: 300, // Increase DPI for better quality
        useCORS: true, // Enable CORS to prevent tainted canvas error
      };

      html2canvas(pdfElement, options).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('BalanceSheet Invoice.pdf');
      });
    }
  }
}
