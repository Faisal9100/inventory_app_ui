// import { Product } from './../warehouse/warehouse.component';
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
import { PageEvent } from '@angular/material/paginator';

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
  searchedPurchaseData: any[]=[];

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
  ip_address = '192.168.1.9:8000';
  stocks: any;

  //  __code for getting AllPurchase__

  // getAllPurchase() {
  //   this.allpurchasesService.getAllPurchase().subscribe((data) => {
  //     this.AllPurchaseData = data.results;
  //   });
  // }
  // getAllPurchaseData() {
    
  //   this.allpurchasesService.getAllPurchase().subscribe((data) => {
  //     this.AllPurchaseData = data.results;
  //     this.isLoading = false; // Set isLoading to false
  //   });
  // }
  getAllPurchaseData() {
    this.isLoading = true; // Set isLoading to true
  
    this.allpurchasesService.getAllPurchase().subscribe((data) => {
      this.AllPurchaseData = data.results;
      this.searchedPurchaseData = this.AllPurchaseData; 
     
      this.isLoading = false; // Set isLoading to false
    });
  }
  
  
  //  __code for getting StockList__
  
  getStockList(id: number) {
    this.isLoading = true; // Set isLoading to true
    this.http
    .get(`http://192.168.1.9:8000/inventory/stocks_purchase/${id}/stocks/`)
    .subscribe((response: any) => {
      this.stocks = response;
      this.isLoading = false; // Set isLoading to true
       
      });
  }

  //  __code for deleting StockList__

  deleteStockList(stockid: number,purchasedId:number) {
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
            `http://192.168.1.9:8000/inventory/stocks_purchase/${purchasedId}/stocks/` +
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

  //  __code for opening model one for adding purchase__

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

   //  __code for opening model one for adding StockList__

  openXl2(content2: any) {
    this.modalService.open(content2, { size: 'xl' });
  }

  //  __code for getting warehouse Data__

  getwarehouse() {
    this.warehouseService.GetWarehouse().subscribe((response) => {
      this.products = <any>response.results;
    });
  }

  //  __code for getting supplier Data__
  
  getSupplier() {
    this.supplierService.fetchsupplier().subscribe((response) => {
      this.suppliers = <any>response.results;
    });
  }

    //  __code for getting Product Data__

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

  // __code for removing product from the table__

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

  // __ code for adding purchase__

  // this.isLoading = true;
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
        // this.isLoading = true;
        // this.getStockList(this.id);
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
          // this.getStockList(this.id);
        });
    }
  }
  searchTerm = '';

  onSearchTermChange() {
    this.searchedPurchaseData = this.AllPurchaseData.filter((purchase) =>
      purchase.title.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
  getPaginationRange() {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array(totalPages).fill(0).map((_, i) => i + 1);
  }
  onPageChange(event: any) {
    this.page = event;
    this.getAllPurchaseData(); // Assuming your method to fetch data is getAllPurchase(page)
  }
  onTableSizeChange(event:any){
    this.tableSize = event.target.value;
    this.page=1
    this.getAllPurchaseData(); // Assuming your method to fetch data is getAllPurchase(page)
  }
    
  count:number = 0;
  page:number= 1;
  tableSize:number = 10;
  tableSizes:any=[5,10,25,100];

}
