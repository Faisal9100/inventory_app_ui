import { Component } from '@angular/core';

@Component({
  selector: 'app-purchase',
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.css']
})
export class PurchaseComponent {
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  id = 'pagination';
  closeResult: any;

  totalItems: any;
  itemsPerPage: any;
  onPageChange(event: any) {
    this.currentPage = event;
    
  }
}
