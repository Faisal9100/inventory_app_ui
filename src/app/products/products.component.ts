import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../category.service';
import { BrandService } from '../brand.service';
import { UnitService } from '../unit.service';
import { ProductService } from '../product.service';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

export interface Product {
  id: number;
  category: any;
  brand: any;
  unit: any;
  name: string;
  image: File;
  quantity: any;
  note: string;
}

@Component({
  selector: 'app-products,ngbd-modal-content',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  @Output() updateCategory = new EventEmitter<any>();
  public ip_address = '192.168.1.9:8000';
  pageIndex: any = 0;
  taskToEdit: any;
  currentPage = 1;
  pageSize = 10;
  totalPages!: number;
  pages: number[] = [];
  closeResult: any;
  totalItems: any;
  itemsPerPage: any;
  products: Product[] = [];
  image: File[] = [];
  brands: { id: number; name: string }[] = [];
  categories: { id: number; name: string }[] = [];
  units: { id: number; name: string }[] = [];
  formBuilder: any;
  selectedFile: any;
  productData1: any;
  public url = 'http://' + this.ip_address + '/inventory/products/';
  public url2 = 'http://' + this.ip_address + '/inventory/products/${id}';

  productForm = new FormGroup({
    name: new FormControl(),
    quantity: new FormControl(),
    note: new FormControl(),
    brand: new FormControl(),
    unit: new FormControl(),
    category: new FormControl(),
    image: new FormControl(),
  });

  constructor(
    private modalService: NgbModal,
    public http: HttpClient,
    config: NgbModalConfig,
    public categoryService: CategoryService,
    public brandService: BrandService,
    public unitService: UnitService,
    public productService: ProductService,
    public fb: FormBuilder
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      note: [''],
      brand: [''],
      unit: [''],
      category: [''],
      image: [''],
    });
  }
  ngOnInit(): void {
    this.getProducts();
    this.categoryService
      .getCategories(this.pageIndex, this.pageSize)
      .subscribe((categories) => (this.categories = categories.results));
    this.brandService
      .getBrand(this.pageIndex, this.pageSize)
      .subscribe((brands) => (this.brands = brands.results));
    this.unitService
      .getUnit(this.pageIndex, this.pageSize)
      .subscribe((units) => (this.units = units.results));
  }

  //  __ code for getting brands from brand component__

  getBrand() {
    this.brandService
      .getBrand(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.brands = data.results;
      });
  }

  //  __ code for getting unit from unit component__

  getUnit() {
    this.unitService
      .getUnit(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.units = data.results;
      });
  }

  //  __ code for getting category from category component__

  getCategories() {
    this.categoryService
      .getCategories(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.categories = response.results;
      });
  }

  //  __ code for getting product__

  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.productData1 = data.results;
    });
  }

  formData = {
    name: '',
    note: '',
    quantity: '',
    unit: '',
    brand: '',
    category: '',
    image: '',
  };

  productData!: {
    map(arg0: (product: { image: any; name: any; quantity: any; category: any; note: any; brand: any; unit: any; }, index: number) => { sn: number; title: any; address: any; balance: any; status: any; contact: any; email: any; unit: any; }): unknown;
    name: any;
    quantity: any;
    note: any;
    brand: any;
    unit: any;
    category: any;
    image: any;
  };

  //  __ code for adding files__

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  //  __code for opening model for adding products__

  open(content: any) {
    this.modalService.open(content);
  }


  //  __ code for adding products__

  addProduct() {
    const productData = {
      name: this.productForm.get('name')?.value,
      quantity: this.productForm.get('quantity')?.value,
      note: this.productForm.get('note')?.value,
      brand: this.productForm.get('brand')?.value,
      unit: this.productForm.get('unit')?.value,
      category: this.productForm.get('category')?.value,
    };

    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('quantity', this.productForm.get('quantity')?.value);
    formData.append('note', this.productForm.get('note')?.value);
    formData.append('brand', this.productForm.get('brand')?.value);
    formData.append('unit', this.productForm.get('unit')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    formData.append('image', this.selectedFile, this.selectedFile.name);
    formData.append('product', JSON.stringify(productData));

    console.log(this.productForm.get('unit')?.value);

    this.productService.addProduct(formData).subscribe(
      (response) => {
        const formData = {
          name: '',
          quantity: '',
          note: '',
          brand: '',
          unit: '',
          category: '',
        };
        console.log(response);
        this.getProducts();
        this.productForm.reset();
        Swal.fire({
          icon: 'success',
          title: 'Product added successfully!',
          showConfirmButton: false,
          timer: 2000,
        });
      },
      (error) => console.log(error),
      () => console.log('error adding product')
    );
  }

  //  __ code for deleteing  products__

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure wants to Delete?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.url}${id}`).subscribe(() => {
          this.getProducts();
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'info');
      }
    });
  }
  updateProduct(product: Product) {
    Swal.fire({
      title: 'Update Warehouse',
      html: `
      <label>Name:</label>
      <input type="text" id="productName" class="swal2-input swal1" placeholder="Name"  value="${
        product.name
      }">
      <br><label>Quantity:</label>
      <input type="number" id="productQuantity" class="swal2-input swal2" placeholder="Quantity"  value="${
        product.quantity
      }">
      <br><label>Note:</label>
      <input type="text" id="productNote" class="swal2-input swal3" placeholder="Note"  value="${
        product.note
      }">
      <br><label>Brand:</label>
      <select id="productBrand" class="swal2-select">
        ${this.brands.map(
          (brand) =>
            `<option value="${brand.id}" ${
              brand.id === product.brand ? 'selected' : ''
            }>${brand.name}</option>`
        )}
      </select>
      <br><label>Unit:</label>
      <select id="productUnit" class="swal2-select">
        ${this.units.map(
          (unit) =>
            `<option value="${unit.id}" ${
              unit.id === product.unit ? 'selected' : ''
            }>${unit.name}</option>`
        )}
      </select>
      <br><label>Category:</label>
      <select id="productCategory" class="swal2-select">
        ${this.categories.map(
          (category) =>
            `<option value="${category.id}" ${
              category.id === product.category ? 'selected' : ''
            }>${category.name}</option>`
        )}
      </select>
    
   
      
    `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedName = (<HTMLInputElement>document.querySelector('.swal1'))
          .value;
        const updatedQuantity = (<HTMLInputElement>(
          document.querySelector('.swal2')
        )).value;
        const updatedNote = (<HTMLInputElement>document.querySelector('.swal3'))
          .value;
        const updatedBrand = (<HTMLSelectElement>(
          document.querySelector('#productBrand')
        )).value;
        const updatedUnit = (<HTMLSelectElement>(
          document.querySelector('#productUnit')
        )).value;
        const updatedCategory = (<HTMLSelectElement>(
          document.querySelector('#productCategory')
        )).value;
       
     
        this.http
          .put(`${this.url}${product.id}/`, {
            name: updatedName,
            quantity: updatedQuantity,
            unit: updatedUnit,
            note: updatedNote,
            brand: updatedBrand,
            category: updatedCategory,
          })
          .subscribe(() => {
            console.log(`Product with ID ${product.id} updated successfully!`);
            this.getProducts();
            Swal.fire(
              'Updated!',
              'Your warehouse has been updated.',
              'success'
            );
          });
      }
    });
  }
  openUpdateModal(product: Product) {
    Swal.fire({
      title: 'Update Product',
      html: `
      <label>Name:</label>
      <input type="text" id="productName" class="swal2-input swal1" placeholder="Name"  value="${
        product.name
      }">
      <br><label>Quantity:</label>
      <input type="text" id="productQuantity" class="swal2-input swal2" placeholder="Quantity"  value="${
        product.quantity
      }">
      <input type="text" id="productBrand" class="swal2-input swal3" placeholder="Brand" value="${
        product.brand
      }">
      <label>Unit:</label>
      <input type="text" id="productUnit" class="swal2-input swal4" placeholder="Unit" value="${
        product.unit
      }">
      <label>Category:</label>
      <input type="text" id="productCategory" class="swal2-input swal5" placeholder="Category" value="${
        product.category
      }">
      <br><label>Note:</label>
      <input type="text" id="productNote" class="swal2-input swal6" placeholder="Note"  value="${
        product.note
      }">
      <br><label>Image:</label>
      <input type="file" id="productImage" accept="image/*">
      <br><br><img src="${product.image}" alt="Product Image" height="50" width="50">
      
    `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedName = (<HTMLInputElement>document.querySelector('.swal1'))
          .value;
        const updatedQuantity = (<HTMLInputElement>(
          document.querySelector('.swal2')
        )).value;
        const updatedNote = (<HTMLTextAreaElement>(
          document.querySelector('.swal6')
        )).value;
        const updatedBrand = (<HTMLInputElement>(
          document.querySelector('#productBrand')
        )).value;
        const updatedUnit = (<HTMLInputElement>(
          document.querySelector('#productUnit')
        )).value;
        const updatedCategory = (<HTMLInputElement>(
          document.querySelector('#productCategory')
        )).value;
        const formData = new FormData();
        formData.append('name', updatedName);
        formData.append('quantity', updatedQuantity);
        formData.append('note', updatedNote);
        formData.append('brand', updatedBrand);
        formData.append('unit', updatedUnit);
        formData.append('category', updatedCategory);
        if (this.selectedFile) {
          formData.append('image', this.selectedFile, this.selectedFile.name);
        }
        this.productService.updateProduct(product.id,formData).subscribe(
          (response) => {
            console.log(response);
            this.getProducts();
            Swal.fire({
              icon: 'success',
              title: 'Product updated successfully!',
              showConfirmButton: false,
              timer: 2000,
            });
          },
          (error) => console.log(error),
          () => console.log('error updating product')
        );
      }
    });
  }
  generatePDF() {
    const columns2 = { title: 'All Products List' };
    
    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'image', dataKey: 'image' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Category', dataKey: 'category' },
      { title: 'Quantity', dataKey: 'quantity' },
      { title: 'Note', dataKey: 'note' },
      { title: 'Brand', dataKey: 'brand' },
      { title: 'Unit', dataKey: 'unit' },
    ];

    const data = this.productData.map((product: { image: any; name: any; quantity: any; category: any; note: any; brand: any; unit: any; }, index: number) => ({
      sn: index + 1,
      title: product.image,
      address: product.name,
      balance: product.quantity,
      status: product.category,
      contact: product.note,
      email: product.brand,
      unit: product.unit,
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
    doc.save('all_products.pdf');
  }  

}
