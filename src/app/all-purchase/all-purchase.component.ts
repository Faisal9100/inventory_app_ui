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
  stock:any;
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
      .get(`http://127.0.0.1:8000/inventory/stocks_purchase/${id}/stocks/`)
      .subscribe((response: any) => {
        this.stocks = response;
        this.isLoading = false; // Set isLoading to true
      });
  }

  //  __code for deleting StockList__

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

  //  __code for opening model one for adding purchase__

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }

  //  __code for opening model one for adding StockList__

  openXl2(content2: any) {
    this.modalService.open(content2, { size: 'xl' });
  }

  // __code for opening model for adding product in stock__
  openXl3(content3: any) {
    this.modalService.open(content3, { size: 'xl' });
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
      stock:this.stockPurchaseData
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
        'http://127.0.0.1:8000/inventory/stocks_purchase/',
        payload
      )
      .subscribe((response) => {
        console.log(response);
        const purchaseId = response.id;
        this.addStock(purchaseId).then((res) => {
          this.getAllPurchaseData();
        });
      });
  }

  // __ code for adding stock purchase__

  async addStock(id: any) {
    console.log(id);
    for (let row of this.rows) {
      let product = {
        product: row.product.id,
        quantity: row.quantity,
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
  postUpdateStock(product: any, id: any) {
    return new Promise((resolve, reject) => {
      this.http
        .put(
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
// Assuming you have the necessary imports and dependencies
updatedStock:any;
// openStockModal(productId: any) {
//   // Open your modal here

//   // Handle form submission or any user interaction to update the stock
//   // Retrieve the updated stock information in the 'updatedStock' variable

//   this.postUpdateStock(this.updatedStock, productId)
//     .then((response) => {
//       // Handle successful response
//       console.log(response);
//       // Close the modal or perform any additional actions
//     })
//     .catch((error) => {
//       // Handle error
//       console.error(error);
//       // Display an error message or perform any additional error handling
//     });
// }
  

  p: any;
  count: number = 0;
  page: number = 1;
  tableSize: number = 10;
  tableSizes: any = [5, 10, 25, 100];
  title: any;
  Search() {
    if (this.title == '') {
      this.ngOnInit();
    } else {
      this.AllPurchaseData = this.AllPurchaseData.filter((res) => {
        return res.title.match(this.title);
      });
    }
  }
  getStock(id: any) {
    return this.http.get(`http://127.0.0.1:8000/inventory/stocks_purchase/${id}/stocks/`);
  }
  openStockModal(productId: any) {
    // Open your modal here
  
    this.getStock(productId)
      .subscribe(
        (response) => {
          // Populate the form fields in the modal with the retrieved data
          const stockData = response; // Assuming the API response is a JSON object representing the stock data
          // Assign the stock data to your form fields in the modal
          this.stockForm.patchValue(stockData);
        },
        (error) => {
          console.error(error);
          // Handle error if necessary
        }
      );
  }
  invoiceNumber?:number;
  stockData:any[]=[];
  onSubmit() {
    const updatedStockData = this.stockForm.value;
    const stockId = updatedStockData.id; // Assuming the stock ID is included in the form data
  
    this.postUpdateStock(updatedStockData, stockId)
      .then((response) => {
        // Handle successful response
        console.log(response);
        // Close the modal or perform any additional actions
      })
      .catch((error) => {
        // Handle error
        console.error(error);
        // Display an error message or perform any additional error handling
      });
  }
  
  
  
  // updateStock() {
  //   for (let row of this.rows) {
  //     const { productid, stock } = row.product; // Assuming productId and stock properties exist on the product object
  
  //     const url = `http://127.0.0.1:8000/inventory/stocks_purchase/${productId}`; // Replace with the appropriate API endpoint for updating a product's stock
  
  //     const body = { stock }; // Assuming the API expects the stock value in the request body
  
  //     this.http.put(url, body).subscribe(
  //       (response) => {
  //         console.log('Stock updated successfully:', response);
  //       },
  //       (error) => {
  //         console.error('Failed to update stock:', error);
  //       }
  //     );
  //   }
  // }
  // getStock(id: number) {
  //   this.isLoading = true; // Set isLoading to true
  //  this.http.put(`http://127.0.0.1:8000/inventory/stocks_purchase/${id}`,id).subscribe(
  //   (response: any) => {
  //     const invoiceNumber = response.invoiceNumber; // Assuming the API response contains the invoiceNumber field
  //     const inputElement = document.getElementById('purchaseInvoice') as HTMLInputElement;
  //     inputElement.value = invoiceNumber;
  //   },
  //   (error) => {
  //     console.error('Failed to retrieve invoice number:', error);
  //   }
  // );
  // }

  
  
}
