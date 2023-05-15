import { AllpurchasesService } from './../allpurchases.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../warehouse.service';
import { SupplierService } from '../supplier.service';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';

export interface PurchaseData {
  id: number;
  invoice: number;
  title: string;
  invoiceNumber: string;
  warehouse: string;
  product: string;
  quantity: number;
  name: any;
  total: number;
  amount: number;
  voucher_type: string;
  date: Date;
}
interface Product {
  id: number;
  name: string;
  price: number;
  product: string;
}

// Define a row interface to represent a row in the table

interface Row {
  product: Product;
  price: number;
  quantity: number;
  total: number;
}
@Component({
  selector: 'app-all-sale',
  templateUrl: './all-sale.component.html',
  styleUrls: ['./all-sale.component.css']
})
export class AllSaleComponent {
  public isProductSelected: boolean = false;
  selectedProducts: {
    id: any;
    product: string;
    quantity: number;
    price: number;
    total: number;
  }[] = [];
  rows: Row[] = [];
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  id: any;
  closeResult: any;
  AllPurchaseData: any[] = [];
  stockPurchaseData: any[] = [];
  totalItems: any;
  itemsPerPage: any;
  products: any[] = [];
  suppliers: any[] = [];
  total: number = 0;
  productData: any[] = [];
  purchaseInvoice?: number;
  purchaseDate?: Date;
  selectedSupplier: any;
  selectedWarehouse: any;
  payableAmount?: number;
  selectedRemark: any;
  purchaseId: any;
  payload: any;

  onPageChange(event: any) {
    this.currentPage = event;
  }

  quantity: number = 0;
  price: number = 0;
  Alltotal: number = 0;
  total1: number = 0;
  total2: number = 0;
  discount: number = 0;
  grandTotal: number = 0;
  totalQuantity: number = 0;

  updateTotal() {
    let total = 0;
    let quantityTotal = 0;
    for (let row of this.rows) {
      total += row.price * row.quantity;
      quantityTotal += row.quantity;
    }
    this.grandTotal = total - this.discount;
    this.totalQuantity = quantityTotal;
  }

  constructor(
    public http: HttpClient,
    public allpurchasesService: AllpurchasesService,
    public activeModal: NgbActiveModal,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public warehouseService: WarehouseService,
    public supplierService: SupplierService,
    public productService: ProductService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.getwarehouse();
    this.getSupplier();
    this.getProducts();
    this.getAllPurchase();
    this.getStockPurchase();
  }
  getAllPurchase() {
    this.allpurchasesService.getAllPurchase().subscribe((data) => {
      this.AllPurchaseData = data.results;
    });
  }
  ip_address = '192.168.1.9:8000';
  getStockPurchase() {
    // console.log(`http://192.168.1.9:8000/inventory/stocks_purchase/${this.purchaseId}/stocks/`);
    // this.http.get('http://' + this.ip_address + 'inventory/stocks_purchase/'+ this.purchaseId +'/stocks').subscribe((response) => {
    //   console.log(response);
    // });
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  openXl2(content2: any) {
    this.modalService.open(content2, { size: 'xl' });
  }

  getwarehouse() {
    this.warehouseService.GetWarehouse().subscribe((response) => {
      this.products = <any>response.results;
    });
  }
  getSupplier() {
    this.supplierService.fetchsupplier().subscribe((response) => {
      this.suppliers = <any>response.results;
    });
  }
  getProducts() {
    this.productService.getProducts().subscribe((Response) => {
      this.productData = <any>Response.results;
    });
  }
  selectedProduct = <any>{
    id: '',
    name: '',
    quantity: 0,
    price: 0,
    total: 0,
  };

  productList: any[] = [];

  newProduct = {
    name: this.selectedProduct.name.toString(),
    price: this.price,
    quantity: this.quantity,
    product: this.selectedProduct.name,
    total: this.total,
  };

  // Define the addProduct method to add the selected product to the table
  addProduct() {
    // Ensure a product is selected
    if (!this.selectedProduct) {
      return;
    }

    // Find the selected product in the productData array
    const selectedProduct = this.productData.find(
      (p) => p.id === this.selectedProduct
    );

    // Calculate the total price based on the product price and quantity
    const total = selectedProduct.price * this.quantity;

    // Create a new row object with the selected product and input values
    const newRow: Row = {
      product: selectedProduct,
      price: selectedProduct.price,
      quantity: this.quantity,
      total: total,
    };

    // Add the new row to the array of rows
    this.rows.push(newRow);

    // Clear the input fields
    this.selectedProduct = '';
  }

  get formattedData(): string {
    const rowStrings = this.rows.map(
      (row) => `${row.product.name}: $${row.total.toFixed(2)}`
    );

    return rowStrings.join('\n');
  }
  removeProduct(index: number) {
    this.rows.splice(index, 1);
    this.updateTotal();
  }
  i: any;

// __ code for deleting purchase__

  deletePurchase(purchaseId: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result: { isConfirmed: any }) => {
      if (result.isConfirmed) {
        this.http
          .delete(
            'http://192.168.1.9:8000/inventory/stocks_purchase/' +
              purchaseId +
              '/'
          )
          .subscribe(
            () => {
              Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
              );

              this.getAllPurchase();
            },
            () => {
              Swal.fire(
                'Error!',
                'Cannot delete stock purchase with child rows in stock.',
                'error'
              );
            }
          );
      }
    });
  }

  // __ code for adding purchase__

  addPurchase() {
    const payload: any = {
      invoice_no: this.purchaseInvoice,
      date: this.purchaseDate,
      account: this.selectedSupplier,
      warehouse: this.selectedWarehouse,
      amount: this.grandTotal,
      quantity: this.totalQuantity,
      title: this.selectedRemark,
    };

    this.http
      .post<{ id: number }>(
        'http://192.168.1.9:8000/inventory/stocks_purchase/',
        payload
      )
      .subscribe((response) => {
        console.log(response);
        const purchaseId = response.id;
        this.addStock(purchaseId);
        // this.getAllPurchase();
      });
  }

// __ code for adding stock purchase__


  addStock(id: any) {
    console.log(id);
    for (let row of this.rows) {
      let product = {
        product: row.product.id,
        quantity: row.quantity,
        amount: row.quantity * row.price,
        date: this.purchaseDate,
        account_supplier: this.selectedSupplier,
        warehouse: this.selectedWarehouse,
        title: this.selectedRemark,
        vocuher_type: 'Purchase',
      };
      this.http
        .post(
          `http://192.168.1.9:8000/inventory/stocks_purchase/${id}/stocks/`,
          product
        )
        .subscribe((response) => {
          console.log(response);
        });
    }
  }
}
