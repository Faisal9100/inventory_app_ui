import { AllpurchasesService } from './../allpurchases.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';

export interface PurchaseData {
  id: number;
  invoice: number;
  title: string;
  supplier_amount: string;
  warehouse: string;
  product: string;
  quantity: number;
  amount: number;
  voucher_type: string;
  date: Date;
}
@Component({
  selector: 'app-all-purchase',
  templateUrl: './all-purchase.component.html',
  styleUrls: ['./all-purchase.component.css'],
})
export class AllPurchaseComponent {
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  id = 'pagination';
  closeResult: any;

  AllPurchaseData: any[] = [];
  totalItems: any;
  itemsPerPage: any;
  purchaseData: PurchaseData = {
    id: 0,
    invoice: 0,
    title: '',
    supplier_amount: '',
    warehouse: '',
    product: '',
    quantity: 0,
    amount: 0,
    voucher_type: '',
    date: new Date(),
  };
  onPageChange(event: any) {
    this.currentPage = event;
  }

  constructor(
    public http: HttpClient,
    public allpurchasesService: AllpurchasesService,
    public activeModal: NgbActiveModal,
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  // getProducts() {
  //   this.allpurchasesService.getAllPurchase().subscribe((data) => {
  //     this.AllPurchaseData = data.results;
  //   });
  // }
  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  getwarehouse() {
    // let skip = (this.currentPage - 1) * this.pageSize;
    // let limit = this.pageSize;
    // let url = `${'http://192.168.1.9:8000/inventory/stocks_purchase/'}?skip=${skip}&limit=${limit}`;

    this.allpurchasesService.getAllPurchase().subscribe((response) => {
      this.AllPurchaseData = <any>response.results;
      // this.totalPages = Math.ceil(response.count / this.pageSize);
      // this.totalItems = response.count;

      // this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
    });
  }
}
