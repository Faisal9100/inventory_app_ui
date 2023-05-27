import { SaleService } from './../sale.service';

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
import { CustomerService } from '../customer.service';

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
  account_customer: string;
  reamrks: string;

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
  product_id: any;
  product: Product;
  product_name: string;
  amount: number;
  quantity: number;
  total: number;
  totalQuantity: number;
  totalAmount: number;
}
@Component({
  selector: 'app-all-sale',
  templateUrl: './all-sale.component.html',
  styleUrls: ['./all-sale.component.css'],
})
export class AllSaleComponent {
  public isProductSelected: boolean = false;
  p: any;
  selectedProducts: {
    id: any;
    product: string;
    quantity: number;
    amount: number;
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
  selectedCustomer: any;
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
  amount: number = 0;
  Alltotal: number = 0;
  total1: number = 0;
  total2: number = 0;
  discount: number = 0;
  grandTotal: number = 0;
  totalQuantity: number = 0;
  totalAmount: number = 0;
  remarks: any;
  account_customer: any;

  updateTotal() {
    let total = 0;
    let quantityTotal = 0;
    let amountTotal = 0;
    for (let row of this.rows) {
      total += row.amount * row.quantity;
      quantityTotal += row.quantity;
      amountTotal += row.amount;
    }
    this.grandTotal = total - this.discount;
    this.totalQuantity = quantityTotal;
    this.totalAmount = amountTotal;
  }

  constructor(
    public http: HttpClient,
    public allpurchasesService: AllpurchasesService,
    public activeModal: NgbActiveModal,
    config: NgbModalConfig,
    private modalService: NgbModal,
    public warehouseService: WarehouseService,
    public supplierService: SupplierService,
    public productService: ProductService,
    public SaleService: SaleService,
    public customerservice: CustomerService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.currentDate = this.getCurrentDate();
  }

  ngOnInit(): void {
    this.getWarehouse();
    this.getCustomer();
    this.getAllPurchase();
  }
  getAllPurchase() {
    this.isLoading = true;
    this.SaleService.getAllPurchase().subscribe((data) => {
      this.AllPurchaseData = data.results;
      this.isLoading = false;
    });
  }

  isLoading: boolean = false;
  getStockList(id: number) {
    this.isLoading = true; // Set isLoading to true
    this.http
      .get(`http://192.168.1.9:8000/inventory/sales/${id}/sale_items`)
      .subscribe((response: any) => {
        this.stocks = response.results;
        console.log(this.stocks);
        this.isLoading = false; // Set isLoading to true
      });
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  openXl2(content2: any) {
    this.modalService.open(content2, { size: 'xl' });
  }

  // <--------------------------- code for getting suppliers ---------------------------------------------->

  getSupplier() {
    this.supplierService.fetchsupplier().subscribe((response) => {
      this.suppliers = <any>response.results;
    });
  }

  // <--------------------------- code for getting customers ---------------------------------------------->

  customers: any[] = [];
  getCustomer() {
    this.customerservice.getAllPurchase().subscribe((response) => {
      this.customers = <any>response.results;
    });
  }

  selectedWarehouseId?: number;

  // <------------------------- code for getting warehouse ----------------------------------------------->

  getWarehouse() {
    this.warehouseService.GetWarehouse().subscribe((response) => {
      this.warehouses = <any>response.results;
      if (this.warehouses.length > 0) {
        this.selectedWarehouse = this.warehouses[0]; // Store the first warehouse object
        this.warehouseId = this.selectedWarehouse.id; // Access the ID from the selected warehouse object
      }
    });
  }

  // <---------- code for getting warehouse by id to get products according to warehouse ID ---------------->

  onWarehouseChange(warehouseId: any) {
    const selectedWarehouse = this.warehouses.find(
      (warehouse: any) => warehouse.id === warehouseId
    );
    if (selectedWarehouse) {
      this.warehouseId = selectedWarehouse.id;
      this.getProductById(warehouseId);
      console.log(this.warehouseId);
    }
  }
  warehouses: any[] = [];
  warehouseId: any;
  productSale: any[] = [];

  // <-------------------------- code for getting product according to warehouse ID ---------------------->

  getProductById(warehouseId: number) {
    this.http
      .get(
        `http://192.168.1.9:8000/inventory/warehouses/${warehouseId}/stocks/`
      )
      .subscribe((resp: any) => {
        this.productSale = resp['results'];
        console.log(this.productSale);
      });
  }

  stocks: any[] = [];

  selectedProduct = <any>{
    id: '',
    name: '',
    quantity: 0,
    amount: 0,
    total: 0,
  };

  productList: any[] = [];
  displayedQuantity?: number;

  // <------------------------ code for adding product when adding new sale ------------------------------->

  product_name: any;
  addProduct() {
    // Ensure a product is selected
    if (!this.selectedProduct) {
      return;
    }

    // Check if the product is already added
    const isProductAdded = this.rows.some(
      (row) => row.product_id === this.selectedProduct
    );

    // If the product is already added, show an error message or perform appropriate actions
    if (isProductAdded) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Product Already Added.',
      });
      return;
    }

    // Find the selected product in the productData array
    const selectedProduct = this.productSale.find(
      (p) => p.product_id == this.selectedProduct
    );

    // Calculate the total quantity based on the selected product quantity and input quantity
    const totalQuantity = selectedProduct ? selectedProduct.quantity : 0;
    const totalAmount = selectedProduct ? selectedProduct.amount : 0;

    if (this.quantity > totalQuantity) {
      // Show an error message or perform appropriate actions
      console.log('Entered quantity exceeds total quantity');
      return;
    }

    // Calculate the total price based on the product price and quantity
    const total = this.amount * this.quantity;
    const amount = 0;

    // Create a new row object with the selected product and input values
    const newRow = {
      product: selectedProduct,
      product_name: selectedProduct.product_name,
      product_id: selectedProduct.product_id,
      amount: amount,
      quantity: this.quantity,
      total: total,
      totalQuantity: totalQuantity,
      totalAmount: totalAmount,
    };
    this.rows.push(newRow);

    // Clear the input fields
    this.selectedProduct = '';
  }

  // <---------------------- code for Removing product when adding new sale ----------------------------->

  removeProduct(index: number) {
    this.rows.splice(index, 1);
    this.updateTotal();
  }
  i: any;

  // <--------------------------------- code for adding Sale ----------------------------------------------->

  addSale() {
    const payload: any = {
      date: this.purchaseDate,
      account: this.selectedCustomer,
      warehouse: this.selectedWarehouse,
      amount: this.grandTotal,
      quantity: this.totalQuantity,
      remarks: this.remarks,
      account_customer: this.selectedCustomer,
    };

    this.http
      .post<{ id: number }>('http://192.168.1.9:8000/inventory/sales/', payload)
      .subscribe(
        (response) => {
          console.log(response);
          const purchaseId = response.id;
          this.addStock(purchaseId);
          this.getAllPurchase();
          this.addProduct();
          this.handleQuantityChange(this.productData);
        },
        (error) => {
          console.error('An error occurred:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while adding the sale.',
          });
        }
      );
  }

  // <--------------------------------- code for deleting Sale --------------------------------------->

  deleteSale(purchaseId: number) {
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
          .delete('http://192.168.1.9:8000/inventory/sales/' + purchaseId + '/')
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

  // <-------------------------- code for adding stock to sale --------------------------------->

  async addStock(id: any) {
    console.log(id);
    for (let row of this.rows) {
      let product = {
        product: row.product_id,
        quantity: row.quantity,
        amount: row.quantity * row.amount,
        price:  row.amount,
        product_id: row.product_id,
        product_name: row.product_name,
      };
      await this.postOneStock(product, id);
    }
    return true;
  }

  postOneStock(product: any, id: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          `http://192.168.1.9:8000/inventory/sales/${id}/sale_items/`,
          product
        )
        .subscribe(
          (response) => {
            resolve(response);
          },
          (error) => reject(error)
        );
    });
  }
  warehouse: any;

  // <---------------------------------- code for search ----------------------------------------->

  Search() {
    if (this.warehouse == '') {
      this.ngOnInit();
    } else {
      this.AllPurchaseData = this.AllPurchaseData.filter((res) => {
        return res.title.match(this.warehouse);
      });
    }
  }

  // <----------------------------- code for deleting stock from sale list ------------------------------------------->
stock_list_id:any;
  deleteSaleList(purchaseId: number) {
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
            `http://192.168.1.9:8000/inventory/sales/${purchaseId}/sale_items/${this.stock_list_id}` 
          )
          .subscribe(
            () => {
              Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
              );
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

  // <------------------------------ MODEL FOR ADDING NEW STOCK IN SALE LIST ----------------------------------->

  openAddProductModal(content3: any, item: any) {
    this.update_purchase_id = item.id;
    this.modalService.open(content3).result.then((result) => {
      if (result === 'add') {
        this.addStock(this.purchaseId);
      }
    });
  }
  update_purchase_id: any;

  // <-------------------------- CODE FOR UPDATING STOCK IN SALE LIST---------------------------------------------->

  postUpdateStock(product: any, q: any, p: any, date: any) {
    if (product && product.id) {
      const currentDate = new Date().toISOString().split('T')[0];
      const requestBody = {
        date: currentDate,
        product: product.value,
        quantity: q.value,
        price: p.value,
        amount: p.value * q.value,
      };
      console.log(requestBody);

      this.http
        .post(
          `http://192.168.1.9:8000/inventory/sales/${this.update_purchase_id}/sale_items/`,
          requestBody
        )
        .subscribe((response) => {
          console.log(response);
          product.value = '';
          q.value = '';
          p.value = '';
          date.value = '';
        });

      console.log('Invalid product data');
    }
  }

  //  <--------------------------- CODE FOR GETTING TOTAL QUANTITY ------------------------------------>

  getTotalQuantity(row: any): number {
    const selectedProduct = this.productSale.find(
      (product) => product.id === row.id
    );
    return selectedProduct ? selectedProduct.quantity : 0;
    return selectedProduct ? selectedProduct.amount : 0;
  }

  //  <--------------------------- CODE FOR GETTING TOTOL AMOUNT ------------------------------------>

  getTotalAmount(row: any): number {
    const selectedProduct = this.productSale.find(
      (product) => product.id === row.id
    );

    return selectedProduct ? selectedProduct.amount : 0;
  }

  //  <--------------------------- CODE FOR GETTING CURRENT DATE ------------------------------------>

  currentDate?: string;
  getCurrentDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = ('0' + (today.getMonth() + 1)).slice(-2);
    const day = ('0' + today.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  //  <--------------------------- CODE FOR CHECKING QUANTITY------------------------------------>

  handleQuantityChange(row: any) {
    if (row.quantity > row.totalQuantity) {
      // Handle the case where the entered quantity exceeds the total quantity
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Quantity cannot exceed available quantity.',
      });
      // Reset the quantity to the previous valid value or any desired action
      row.quantity = row.totalQuantity;
    } else {
      this.updateTotal();
    }
  }

//  <--------------------------- CODE FOR CHECKING PRICE------------------------------------>

  handlePriceChange(row: any) {
    if (row.amount <= row.product.price) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Quantity cannot exceed available quantity.',
      });
      row.amount = row.product.price; // Reset the amount to the available amount
    }
  }
  
}

//  <---------------------------SALE ALL WORK END HERE------------------------------------>
