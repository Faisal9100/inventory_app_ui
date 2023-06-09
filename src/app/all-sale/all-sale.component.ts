import { ProductService } from './../product.service';
import { Account } from './../accountlayer/accountlayer.component';
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
import Swal from 'sweetalert2';
import { CustomerService } from '../customer.service';
import { LocalhostApiService } from '../localhost-api.service';

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
  purchase_id: number;
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
  defaultPurchasePrice?: number;
  priceError: boolean = false;

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
    public customerservice: CustomerService,
    public api: LocalhostApiService
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
      .get(`http://` + this.api.localhost + `/inventory/sales/${id}/sale_items`)
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
        `http://` +
          this.api.localhost +
          `/inventory/warehouses/${warehouseId}/stocks/`
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
    purchase_id: '',
  };

  productList: any[] = [];
  displayedQuantity?: number;

  // <------------------------ code for adding product when adding new sale ------------------------------->

  product_name: any;
  quantityCheck_Product: any;
  addProduct() {
    // Ensure a product is selected
    if (!this.selectedProduct) {
      return;
    }

    // Check if the product is already added
    const isProductAdded = this.rows.some(
      (row) => row.product_id === this.selectedProduct.id
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
    let quantityCheck_Product = selectedProduct ? selectedProduct.quantity : 0;

    if (this.quantity > totalQuantity) {
      // Show an error message or perform appropriate actions
      Swal.fire({
        title: 'error',
        text: 'You do not have any quantity left ',
        icon: 'error',
        confirmButtonText: 'ok',
        timer: 2000,
      });
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
      purchase_id: selectedProduct.purchase_id,
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
    if (
      !this.purchaseDate ||
      !this.selectedCustomer ||
      !this.selectedWarehouse
    ) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the required fields.',
      });
      return; // Stop the execution if the form is empty
    }

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
      .post<{ id: number }>(
        'http://' + this.api.localhost + '/inventory/sales/',
        payload
      )
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
          .delete(
            'http://' +
              this.api.localhost +
              '/inventory/sales/' +
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

  // <-------------------------- code for adding stock to sale --------------------------------->

  async addStock(id: any) {
    console.log(id);
    for (let row of this.rows) {
      let product = {
        product: row.product_id,
        quantity: row.quantity,
        amount: row.quantity * row.amount,
        price: row.amount,
        product_id: row.product_id,
        product_name: row.product_name,
        stock: row.purchase_id,
      };
      await this.postOneStock(product, id);
    }
    return true;
  }

  postOneStock(product: any, id: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          `http://` + this.api.localhost + `/inventory/sales/${id}/sale_items/`,
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
    if (this.remarks === '') {
      this.ngOnInit();
    } else {
      this.AllPurchaseData = this.AllPurchaseData.filter((res) => {
        return res.remarks.includes(this.remarks);
      });
    }
  }

  // <----------------------------- code for deleting stock from sale list ------------------------------------------->
  stock_list_id: any;
  deleteStockList(stockid: number, stock: number) {
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
            `http://` +
              this.api.localhost +
              `/inventory/sales/${stock}/sale_items/` +
              stockid +
              '/'
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

  // deleteSaleList(stock: any) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover this account!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel',
  //   }).then((result: { isConfirmed: any }) => {
  //     if (result.isConfirmed) {
  //       this.http
  //         .delete(
  //           `http://${this.api.localhost}/inventory/sales/${stock?.id}/sale_items/`
  //         )
  //         .subscribe(
  //           () => {
  //             Swal.fire(
  //               'Deleted!',
  //               'Your product has been deleted.',
  //               'success'
  //             );
  //           },
  //           () => {
  //             Swal.fire(
  //               'Error!',
  //               'Cannot delete stock purchase with child rows in stock.',
  //               'error'
  //             );
  //           }
  //         );
  //     }
  //   });
  // }

  // <------------------------------ MODEL FOR ADDING NEW STOCK IN SALE LIST ----------------------------------->
  warehouse_ID: any;
  warehouse_Name: any;
  openAddProductModal(content3: any, item: any) {
    this.update_purchase_id = item.id;
    this.warehouse_ID = item.warehouse;
    this.warehouse_Name = item.warehouse_name;
    this.modalService.open(content3).result.then((result) => {
      if (result === 'add') {
        this.addStock(this.purchaseId);
      }

      this.ngOnDestroy();
    });
  }

  ngOnDestroy() {
    // Reset the values when the component is destroyed (modal is closed)
    this.update_purchase_id = null;
    this.warehouse_ID = null;
    this.warehouse_Name = null;
  }

  update_purchase_id: any;

  // <-------------------------- CODE FOR UPDATING STOCK IN SALE LIST---------------------------------------------->

  // postUpdateStock(product: any, q: any, p: any, date: any) {
  //   if (
  //     !product.value ||
  //     !q.value ||
  //     !p.value ||
  //     !date.value ||
  //     !this.selectedWarehouse
  //   ) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Please fill in all the required fields.',
  //     });
  //     return; // Stop the execution if any field is empty
  //   }

  //   if (product && product.id) {
  //     const currentDate = new Date().toISOString().split('T')[0];
  //     const requestBody = {
  //       date: currentDate,
  //       product: product.value,
  //       quantity: q.value,
  //       price: p.value,
  //       amount: p.value * q.value,
  //       stock: this.selectedWarehouse,
  //     };
  //     console.log(requestBody);

  //     this.http
  //       .post(
  //         `http://` +
  //           this.api.localhost +
  //           `/inventory/sales/${this.update_purchase_id}/sale_items/`,
  //         requestBody
  //       )
  //       .subscribe(
  //         (response) => {
  //           console.log(response);
  //           product.id = ''; // Clear the product id
  //           product.value = ''; // Clear the product value
  //           q.value = '';
  //           p.value = '';
  //           date.value = '';
  //           this.selectedWarehouse.value = '';
  //           this.modalService.dismissAll();
  //           Swal.fire({
  //             icon: 'success',
  //             title: 'Success',
  //             text: 'Product added successfully.',
  //           });
  //         },
  //         (error) => {
  //           console.error(error);
  //           // Handle the error here, show an error message, etc.
  //           Swal.fire({
  //             icon: 'error',
  //             title: 'Error',
  //             text: 'Failed to add the product.',
  //           });
  //         }
  //       );
  //   }
  // }
  selectedProductQuantity: number = 0;
  postUpdateStock(product: any, q: any, p: any, date: any) {
    if (!product.value || !q.value || !p.value || !date.value) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the required fields.',
      });
      return;
    }
    const selectedProductId = product.value;
    const selectedProductQuantity = q.value;
    const selectedProductPrice = p.value;

    const n: any = this.productSale.find(
      (item) => item.product_id == selectedProductId
    );
    const totalProductQuantity = n ? n.quantity : '';
    const defaultProductPrice = n ? n.price : '';

    if (selectedProductQuantity > totalProductQuantity) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Quantity cannot be greater than the available product quantity.',
      });
      return;
    }
    if (selectedProductPrice < defaultProductPrice) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Price cannot be less than the default product price.',
      });
      return;
    }
    const m: any = this.productSale.find(
      (item) => item.product_id == product.value
    );
    const purchase_id = m ? m.purchase_id : 0;
    if (product && product.id) {
      const currentDate = new Date().toISOString().split('T')[0];
      const requestBody = {
        date: currentDate,
        product: product.value,
        quantity: q.value,
        price: p.value,
        amount: p.value * q.value,
        stock: purchase_id,
      };
      console.log(requestBody);

      this.http
        .post(
          `http://` +
            this.api.localhost +
            `/inventory/sales/${this.update_purchase_id}/sale_items/`,
          requestBody
        )
        .subscribe(
          (response) => {
            console.log(response);
            product.id = '';
            product.value = '';
            q.value = '';
            p.value = '';
            date.value = '';

            this.modalService.dismissAll();
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Product added successfully.',
            });
          },
          (error) => {
            console.error(error);
            // Handle the error here, show an error message, etc.
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add the product.',
            });
          }
        );
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
        text: 'Price cannot be less than or equal to default purchase price.',
      });
      row.amount = row.product.price;
    }
  }
  refreshPage() {
    window.location.reload();
  }
  getProductQuantity(productId: number) {
    const selectedProduct22 = this.productSale.find(
      (product) => product.product_id === productId
    );
    return selectedProduct22 ? selectedProduct22.quantity : 0;
  }
  totalproductQuantity: number = 0;
  // totalQuantity: number = 0;
  totalproductPrice: number = 0;
  getProductPurchase_id: any;

  getProductTotalQuantity(event: any) {
    let p: any = this.productSale.find(
      (item) => item.product_id == event.target.value
    );
    this.totalproductQuantity = p.quantity;
  }
  totalproductTotalPrice(event: any) {
    let q: any = this.productSale.find(
      (item) => item.product_id == event.target.value
    );
    this.totalproductPrice = q.price;
    console.log(this.totalproductPrice);
  }
  getPurchase_id(event: any) {
    let i: any = this.productSale.find(
      (item) => item.product_id == event.target.value
    );
    this.getProductPurchase_id = i.purchase_id;
  }

  // updateTotalQuantity() {
  //   this.totalproductQuantity = this.quantity || 0;
  // }

  selectedProduct22: any;
  quantity22: any;
  producttotalQuantity: number = 0;
  selectedProductPrice: number = 0;
  q: any;
}

//  <---------------------------SALE ALL WORK END HERE------------------------------------>
