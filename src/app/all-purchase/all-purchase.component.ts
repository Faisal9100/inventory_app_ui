import { Product } from './../warehouse/warehouse.component';
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
import { NgSelectConfig } from '@ng-select/ng-select';
import { ProductService } from '../product.service';

export interface PurchaseData {
  id: number;
  invoice: number;
  title: string;
  supplier_amount: string;
  warehouse: string;
  product: string;
  quantity: number;
  name:any;
  total:number,
  amount: number;
  voucher_type: string;
  date: Date;
}
@Component({
  selector: 'app-all-purchase',
  templateUrl: './all-purchase.component.html',
  styleUrls: ['./all-purchase.component.css'],
})
export class AllPurchaseComponent implements OnInit {
  public isProductSelected: boolean = false;
  // public selectedProduct: any;
  selectedProducts: { product: any, quantity: number, price: number, total: number }[] = [];

  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  id = 'pagination';
  closeResult: any;
  AllPurchaseData: any[] = [];
  totalItems: any;
  itemsPerPage: any;
  products: any[] = [];
  suppliers: any[] = [];
  productData: any[] = [];
  purchaseData: PurchaseData = {
    id: 0,
    invoice: 0,
    title: '',
    name:'',
    supplier_amount: '',
    warehouse: '',
    total:0,
    product: '',
    quantity: 0,
    amount: 0,
    voucher_type: '',
    date: new Date(),
  };

  onPageChange(event: any) {
    this.currentPage = event;
  }
  quantity: number = 0;
  price: number = 0;
  total: number = 0;
  discount: number = 0;
  

  updateTotal() {
    this.total = this.quantity * this.price - this.discount;
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
  }
  getAllPurchase() {
    this.allpurchasesService.getAllPurchase().subscribe((data) => {
      this.AllPurchaseData = data.results;
    });
  }

  openXl(content: any) {
    this.modalService.open(content, { size: 'xl' });
  }
  //   getwarehouse() {
  //  this.warehouseService.GetWarehouse().subscribe((response) => {
  //       this.products = <any>response.results;

  //     });
  //   }
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
  selectedProduct = {
    name: '',
    quantity: 0,
    price: 0,
    total: 0,
  };
  // addProduct() {
  //   this.selectedProducts.push(this.selectedProduct);
  //   this.selectedProduct = {
  //     product: '',
  //     quantity: 0,
  //     price: 0,
  //     total: 0
  //   };
    productList: any[] = [];
    // addProduct() {
    //   if (this.isProductSelected && this.quantity && this.price && this.total) {
    //     this.productList.push({
    //       quantity: this.quantity,
    //       price: this.price,
    //       total: this.total
    //     });
    //     // reset form values
       
    //   }
    // }
    
    // addProduct() {
    //   if (this.selectedProduct && !this.selectedProducts.includes(this.selectedProduct)) {
    //     this.selectedProducts.push(this.selectedProduct);
    //   }
      
    // }
  
    addProduct() {
      if (this.selectedProduct) {
        // Check if a product with the same name already exists
        const existingProduct = this.selectedProducts.find(p => p.product === this.selectedProduct.name);
    
        if (existingProduct) {
          // If a product with the same name already exists, update its quantity instead of adding a new one
          existingProduct.quantity++;
        } else {
          // If a product with the same name doesn't exist, add the selected product to the selectedProducts array
          let newProduct = {
            product: this.selectedProduct.name,
            price: this.selectedProduct.price,
            total:this.selectedProduct.total,
            quantity: 1 // You can set the quantity to whatever you like
          };
          newProduct.total= newProduct.price * newProduct.quantity; // Calculate the total
          this.selectedProducts.push(this.newProduct);
        }
    
        // Reset the selectedProduct variable
        this.selectedProduct;
      }
    }
    
     newProduct = {
      name: this.selectedProduct.name.toString(),
      price: this.price,
      quantity: this.quantity,
      product: this.selectedProduct.name,
      total:this.total,
    };
    
    
    // selectedProducts: any[] = [];

// addProduct() {
//   if (this.selectedProduct) {
//     // Add the selected product to the selectedProducts array
//     this.selectedProducts.push({
//       product: this.selectedProduct.product,
//       quantity: 1 // You can set the quantity to whatever you like
//     });

//     // Reset the selectedProduct variable
//     this.selectedProduct = null;
//   }
// }

    
  }
  
  
 
  



