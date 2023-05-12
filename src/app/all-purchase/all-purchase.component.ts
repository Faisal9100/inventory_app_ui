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
  selector: 'app-all-purchase',
  templateUrl: './all-purchase.component.html',
  styleUrls: ['./all-purchase.component.css'],
})
export class AllPurchaseComponent implements OnInit {
  public isProductSelected: boolean = false;
  // public selectedProduct: any;
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

  // purchaseData: PurchaseData = {
  //   id: 0,
  //   invoice: 0,
  //   title: '',
  //   name: '',
  //   supplier_amount: '',
  //   warehouse: '',
  //   total: 0,
  //   product: '',
  //   quantity: 0,
  //   amount: 0,
  //   voucher_type: '',
  //   date: new Date(),
  // };

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

  // updateTotal() {
  //   let total = 0;
  //   let quantityTotal = 0;
  //   for (let row of this.rows) {
  //     total += row.price * row.quantity;
  //     quantityTotal += row.quantity;
  //   }
  //   this.grandTotal = total - this.discount;
  //   this.totalQuantity = quantityTotal;
  // }
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

  // quantity += row.quantity;
  // let quantity = 0;

  // modify the updateTotal() function
  // updateTotal() {
  //   this.rows.forEach(row => {
  //     row.total = row.price * row.quantity;
  //   });

  //   this.grandTotal = this.rows.reduce((acc, row) => acc + row.total, 0);
  // }

  // updateTotal() {
  //   this.total = this.quantity * this.price - this.discount;
  // }

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
  }
  getAllPurchase() {
    this.allpurchasesService.getAllPurchase().subscribe((data) => {
      this.AllPurchaseData = data.results;
    });
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
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
    // Map the rows array to an array of strings representing each row
    const rowStrings = this.rows.map(
      (row) => `${row.product.name}: $${row.total.toFixed(2)}`
    );

    // Join the row strings with line breaks
    return rowStrings.join('\n');
  }
  removeProduct(index: number) {
    this.rows.splice(index, 1);
    this.updateTotal();
  }
  i: any;

  // addPurchase() {
  //   const payload:any = {
  //     invoice_no: this.purchaseInvoice,
  //     date: this.purchaseDate,
  //     account: this.selectedSupplier,
  //     warehouse: this.selectedWarehouse,
  //     amount: this.grandTotal,
  //     quantity: this.totalQuantity,
  //     title: this.selectedRemark,
  //   };
  //   console.log(payload);
  //   let purchaseId: number;
  //   this.http.post("http://192.168.1.9:8000/inventory/stocks_purchase/", payload).subscribe((response) => {
  //     purchaseId=response.id;
  //     console.log(purchaseId);
  //   });

  // }
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
    console.log(payload);

    this.http
      .post<{ id: number }>(
        'http://192.168.1.9:8000/inventory/stocks_purchase/',
        payload
      )
      .subscribe((response) => {
        const purchaseId = response.id;
        console.log(purchaseId);
        this.addStock(purchaseId);
      });
  }

  // addStock(id: any) {
  //   let products = [];
  //   for (let row of this.rows) {
  //     let product = {
  //       product: row.product.id,
  //       quantity: row.quantity,
  //       amount: row.quantity * row.price,
  //     };
  //     products.push(product);
  //   }

  //   const payload = {
  //     date: this.purchaseDate,
  //     account_supplier: this.selectedSupplier,
  //     warehouse: this.selectedWarehouse,
  //     title: this.selectedRemark,
  //     products: products,
  //     purchase_id: id,
  //   };

  //   console.log(payload);
  //   this.http
  //     .post(
  //       `http://localhost:3000/inventory/stocks_purchase/${id}/stocks`,
  //       payload
  //     )
  //     .subscribe((response) => {
  //       console.log(response);
  //     });
  // }
  // addStock(id: any) {
  //   if (id === undefined) {
  //     console.error('No purchase ID specified');
  //     return;
  //   }
  
 
  // let newProducts:any[]=[];

  //   for (let row of newProducts) {
  //     let product = {
  //       product: row.product.id,
  //       quantity: row.quantity,
  //       amount: row.quantity * row.price,
  //     };
  //     newProducts.push(product);
  //   }
  //   const payload = {
  //     date: this.purchaseDate,
  //     account_supplier: this.selectedSupplier,
  //     warehouse: this.selectedWarehouse,
  //     title: this.selectedRemark,
  //     products: this.newProduct.map((row) => {
  //             return {
  //               product: row.product.id,
  //               quantity: row.quantity,
  //               amount: row.quantity * row.price,
  //             };
  //           }),
  //     quantity:this.totalQuantity,
  //     purchase_id: id,
  //   };
  
  
  //   console.log(payload);
  //   this.http
  //     .post(
  //       `http://192.168.1.9:8000/inventory/stocks_purchase/${id}/stocks/`,
  //       payload
  //     )
  //     .subscribe((response) => {
  //       const purchaseId = response;
  //       console.log(purchaseId);
  //     });
  // }
  

//   addStock(id:any) {
//     let Products:any[]=[];

//     for (let item of Products) {
//       let product = {
//         product: item.product.id,
//         quantity: item.quantity,
//         amount: item.quantity * item.price,
//       };
//       Products.push(product);
//     }
//     const formData = {
//       date: this.purchaseDate,
//       account_supplier: this.selectedSupplier,
//       warehouse: this.selectedWarehouse,
//       title: this.selectedRemark,
//       quantity:this.totalQuantity,
//       purchase_id: id,
//       voucher_type:'purchase',
    
//     };
//     console.log(formData);
//   this.http.post(`http://192.168.1.9:8000/inventory/stocks_purchase/${id}/stocks/`, formData).subscribe((response) => {
//     console.log(response);
//   });
 
// }
addStock(id: any) {
  let Products = [];
  for (let row of this.rows) {
    let product = {
      product: row.product.id,
      quantity: row.quantity,
      amount: row.quantity * row.price,
        date: this.purchaseDate,
        account_supplier: this.selectedSupplier,
        warehouse: this.selectedWarehouse,
        title: this.selectedRemark,
        purchase_id: id,
        vocuher_type:'Purchase',
         // include the products array in the payload
      };
      
    
      console.log(product);
    
      this.http.post(`http://192.168.1.9:8000/inventory/stocks_purchase/${id}/stocks/`, product).subscribe((response) => {
        console.log(response);
      });
    };
    
  }
  

  // const formData = {
  //   date: this.purchaseDate,
  //   account_supplier: this.selectedSupplier,
  //   warehouse: this.selectedWarehouse,
  //   title: this.selectedRemark,
  //   products: products,
  //   quantity:this.totalQuantity,
  //   purchase_id: id,
  //   voucher_type: "purchase",
  // };
 
}

