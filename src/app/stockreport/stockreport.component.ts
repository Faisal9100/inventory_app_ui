import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';
import { WarehouseService } from '../warehouse.service';
import { ProductService } from '../product.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-stockreport',
  templateUrl: './stockreport.component.html',
  styleUrls: ['./stockreport.component.css'],
})
export class StockreportComponent {
  constructor(
    public http: HttpClient,
    public api: LocalhostApiService,
    public warehouse: WarehouseService,
    public product: ProductService
  ) {
    this.getWarehouse();
    this.getProducts();
  }
  public url2 =
    this.api.localhost + '/inventory/reports/stock?type=warehouse&warehouse=3';
  public url3 = this.api.localhost + '/inventory/warehouses/';
  public url4 = this.api.localhost + '/inventory/products/';

  selectedProductId: any;
  selectedWarehouseId: any;
  selectedFilter: any;

  Stocks: any[] = [];
  Stocks2: any[] = [];

  // <======================================= CODE FOR GETTING STOCK REPORT ===================================>

  getStockReport() {
    this.Stocks = [];
    if (!this.selectedProductId) {
      return;
    }

    this.http
      .get(
        this.api.localhost +
          `/inventory/reports/stock?type=product&product=${this.selectedProductId}`
      )
      .subscribe((data) => {
        this.Stocks = data as any[];
      });
    this.Stocks2 = [];
    this.Stocks = [];
    this.selectedWarehouseId = null;
    this.selectedProductId = null;
  }

  // <==================================== CODE FOR GETTING WAREHOUSE REPORT ===================================>

  getStockWarehouseReport() {
    if (!this.selectedWarehouseId) {
      return;
    }

    this.http
      .get(
        this.api.localhost +
          `/inventory/reports/stock?type=warehouse&warehouse=${this.selectedWarehouseId}`
      )
      .subscribe((data) => {
        this.Stocks2 = data as any[];
      });

    this.Stocks2 = [];
    this.Stocks = [];
    this.selectedWarehouseId = null;
    this.selectedProductId = null;
  }

  // <======================================= CODE FOR GETTING PRODUCTS ===================================>

  products: any = {};
  getProducts() {
    this.http.get(this.url4).subscribe((data) => {
      this.products = data as any[];
    });
  }

  // <======================================= CODE FOR GETTING WAREHOUSE ===================================>

  warehouses: any = {};
  getWarehouse() {
    this.http.get(this.url3).subscribe((data) => {
      this.warehouses = data as any[];
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
        pdf.save('Stock Report.pdf');
      });
    }
  }
}
