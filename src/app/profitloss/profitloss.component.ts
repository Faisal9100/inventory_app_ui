import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { LocalhostApiService } from '../localhost-api.service';

@Component({
  selector: 'app-profitloss',
  templateUrl: './profitloss.component.html',
  styleUrls: ['./profitloss.component.css'],
})
export class ProfitlossComponent {
  public url = this.api.localhost + '/inventory/profitloss/';
  constructor(public http: HttpClient, public api: LocalhostApiService) {
    this.getProfitLoss();
  }


// <========================================= CODE FOR GETTING PROFIT & LOSS ===============================>

  profit: any[] = [];
  getProfitLoss() {
    this.http.get(this.url).subscribe((res: any) => {
      this.profit = Object.entries(res);
      console.log(this.profit);
    });
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
        pdf.save('Profit & Loss Invoice.pdf');
      });
    }
  }

  }
  
  

