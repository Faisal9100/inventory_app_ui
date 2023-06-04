// import { Product } from './../warehouse/warehouse.component';
import { AllpurchasesService } from './../allpurchases.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../warehouse.service';
import { SupplierService } from '../supplier.service';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

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

interface Row {
  product: Product;
  price: number;
  quantity: number;
  total: number;
  stock: any;
}

@Component({
  selector: 'app-all-purchase',
  templateUrl: './all-purchase.component.html',
  styleUrls: ['./all-purchase.component.css'],
})
export class AllPurchaseComponent implements OnInit {
  public isProductSelected: boolean = false;
  selectedProducts: {
    id: any;
    product: string;
    quantity: number;
    price: number;
    total: number;
  }[] = [];
  rows: Row[] = [];
  totalPages!: number;
  pages: number[] = [];
  id: any;
  closeResult: any;
  AllPurchaseData: any[] = [];
  stockPurchaseData: any[] = [];

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
  isLoading = false;

  pageSize = 10; // Number of items per page
  currentPage = 1; // Current page number
  totalItems = 0; // Total number of items

  quantity: number = 0;
  price: number = 0;
  Alltotal: number = 0;
  total1: number = 0;
  total2: number = 0;
  discount: number = 0;
  grandTotal: number = 0;
  totalQuantity: number = 0;
  searchedPurchaseData: any[] = [];
  value: any;
  stockForm: any;

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
    this.getAllPurchaseData();
  }
  ip_address = '127.0.0.1:8000';
  stocks: any;

  // <----------------------------- code for getting AllPurchase ---------------------------------->

  getAllPurchaseData() {
    this.isLoading = true;

    this.allpurchasesService.getAllPurchase().subscribe((data) => {
      this.AllPurchaseData = data.results;
      this.searchedPurchaseData = this.AllPurchaseData;

      this.isLoading = false;
    });
  }

  // <------------------------------ code for getting StockList ------------------------------------->

  getStockList(id: number) {
    this.isLoading = true;
    this.http
      .get(`http://127.0.0.1:8000/inventory/stocks_purchase/${id}/stocks/`)
      .subscribe((response: any) => {
        this.stocks = response;
        this.isLoading = false;
      });
  }

  //  <------------------------------code for deleting StockList ----------------------------------->

  deleteStockList(stockid: number, purchasedId: number) {
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
            `http://127.0.0.1:8000/inventory/stocks_purchase/${purchasedId}/stocks/` +
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

              this.getStockList(purchasedId);
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

  // <-------------------- code for opening model one for adding purchase ---------------------------------->

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  //  <-------------------- code for opening model one for adding StockList ------------------------------->

  openXl2(content2: any) {
    this.modalService.open(content2, { size: 'xl' });
  }

  // <-------------------- code for opening model for adding product in stock ----------------------------->

  openXl3(content3: any) {
    this.modalService.open(content3);
  }

  //  <------------------------------ code for getting warehouse Data ------------------------------------->

  getwarehouse() {
    this.warehouseService.GetWarehouse().subscribe((response) => {
      this.products = <any>response.results;
    });
  }

  //  <-------------------------------- code for getting supplier Data ------------------------------------>

  getSupplier() {
    this.supplierService.fetchsupplier().subscribe((response) => {
      this.suppliers = <any>response.results;
    });
  }

  //  <---------------------------- code for getting Product Data ------------------------------------------>

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
      stock: this.stockPurchaseData,
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

  // <------------------------code for removing product from the table ------------------------------------->

  removeProduct(index: number) {
    this.rows.splice(index, 1);
    this.updateTotal();
  }
  i: any;

  // <----------------------------- code for deleting stock purchase ---------------------------------------->

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
            'http://127.0.0.1:8000/inventory/stocks_purchase/' +
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

              this.getAllPurchaseData();
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

  // <------------------------------- code for adding stock purchase ----------------------------------->

  addPurchase() {
    if (
      !this.purchaseDate ||
      !this.selectedSupplier ||
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
      account: this.selectedSupplier,
      warehouse: this.selectedWarehouse,
      // amount: this.grandTotal,
      // quantity: this.totalQuantity,
      title: this.selectedRemark,
    };

    this.http
      .post<{ id: number }>(
        'http://127.0.0.1:8000/inventory/stocks_purchase/',
        payload
      )
      .subscribe((response) => {
        console.log(response);
        const purchaseId = response.id;
        this.addStock(purchaseId).then((res) => {
          this.getAllPurchaseData();
        });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Purchase added successfully.',
        });
      });
  }

  openAddProductModal(content3: any, item: any) {
    this.update_purchase_id = item.id;
    this.modalService.open(content3).result.then((result) => {
      if (result === 'add') {
        this.addStock(this.purchaseId);
        // this.addProduct();
      }
    });
  }

  // <---------------------------- code for adding stock purchase ------------------------------------------->

  async addStock(id: any) {
    for (let row of this.rows) {
      let product = {
        product: row.product.id,
        quantity: row.quantity,
        price: row.price,
        amount: row.quantity * row.price,
        date: this.purchaseDate,
      };
      await this.postOneStock(product, id);
    }
    return true;
  }

  postOneStock(product: any, id: any) {
    return new Promise((resolve, reject) => {
      this.http
        .post(
          `http://127.0.0.1:8000/inventory/stocks_purchase/${id}/stocks/`,
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

  //   <-----------------------------adding another product-------------------------------------------->

  update_purchase_id: any;
  // postUpdateStock(product: any, q: any, p: any, date: any) {
  //   if (!product.value || !q.value || !p.value || !date.value) {
  //     Swal.fire({
  //       icon: 'error',
  //       title: 'Error',
  //       text: 'Please fill in all the required fields.',
  //     });
  //     return;
  //   }
  //   if (product && product.id) {
  //     const requestBody = {
  //       date: date.value,
  //       product: product.value,
  //       quantity: q.value,
  //       price: p.value,
  //       amount: p.value * q.value,
  //     };

  //     console.log(requestBody);

  //     this.http
  //       .post(
  //         `http://127.0.0.1:8000/inventory/stocks_purchase/${this.update_purchase_id}/stocks/`,
  //         requestBody
  //       )
  //       .subscribe((response) => {
  //         console.log(response);
  //       });
  //   } else {
  //     console.log('Invalid product data');
  //   }
  // }
  postUpdateStock(product: any, q: any, p: any, date: any) {
    if (!product.value || !q.value || !p.value || !date.value) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in all the required fields.',
      });
      return;
    }
  
    if (product && product.id) {
      const requestBody = {
        date: date.value,
        product: product.value,
        quantity: q.value,
        price: p.value,
        amount: p.value * q.value,
      };
  
      console.log(requestBody);
  
      this.http
        .post(
          `http://127.0.0.1:8000/inventory/stocks_purchase/${this.update_purchase_id}/stocks/`,
          requestBody
        )
        .subscribe(
          (response) => {
            console.log(response);
            Swal.fire({
              icon: 'success',
              title: 'Success',
              text: 'Stock added successfully.',
            });
          },
          (error) => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Failed to add stock.',
            });
          }
        );
    }
  }
  

  updatedStock: any;
  p: any;
  count: number = 0;
  page: number = 1;
  tableSize: number = 10;
  tableSizes: any = [5, 10, 25, 100];
  title: any;

  // <---------------------------------- code for search input field -------------------------------------------->

  Search() {
    if (this.title == '') {
      this.ngOnInit();
    } else {
      this.AllPurchaseData = this.AllPurchaseData.filter((res) => {
        return res.title.match(this.title);
      });
    }
  }

  // <----------- code for getting stock data for a particular product in a particular purchase id -------------->

  getStock(id: any) {
    return this.http.get(
      `http://127.0.0.1:8000/inventory/stocks_purchase/${id}/stocks/`
    );
  }

  // <----------------- model for opening stock model for a particular product in a particular purchase id -------->

  openStockModal(productId: any) {
    this.getStock(productId).subscribe(
      (response) => {
        const stockData = response;

        this.stockForm.patchValue(stockData);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  invoiceNumber?: number;
  stockData: any[] = [];

  // <------------------------------------ code for refreshing page -------------------------------------------->

  refreshPage() {
    window.location.reload();
  }

  // <-------------------------------------- code for print Reciept   ---------------------------------------->

  generatePDF() {
    const columns2 = { title: 'All Purchase List' };

    const columns = [
      { title: '#', dataKey: '#' },
      { title: 'Invoice No', dataKey: 'invoice_no' },
      { title: 'Title', dataKey: 'title' },
      { title: 'Account Name', dataKey: 'account_name' },
      { title: 'Warehouse', dataKey: 'warehouse' },
      { title: 'Transaction_ID', dataKey: 'transaction' },
      { title: 'Quantity', dataKey: 'quantity' },
      { title: 'Amount', dataKey: 'amount' },
      { title: 'date', dataKey: 'date' },
    ];

    const data = this.AllPurchaseData.map((item, index) => ({
      sn: index + 1,
      id: item.id,
      ivoiceNo: item.invoice_no,
      title: item.title,
      accountName: item.account_name,
      warehouse: item.warehouse_name,
      transaction: item.transaction,
      quantity: item.quantity,
      amount: item.amount,
      date: item.date,
    }));

    const doc = new jsPDF();

    doc.text(columns2.title, 86, 8);
    doc.setFontSize(22);
    // doc.setTextColor('red');
    doc.setFontSize(16);

    (doc as any).autoTable({
      columns: columns,
      body: data,
    });
    doc.save('All-Purshase.pdf');
  }
}
