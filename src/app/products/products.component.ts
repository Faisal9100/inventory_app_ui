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
import { LocalhostApiService } from '../localhost-api.service';

export interface Product {
  id: number;
  category: any;
  brand: any;
  unit: any;
  name: string;
  image: File;
  // quantity: any;
  note: string;
}

@Component({
  selector: 'app-products,ngbd-modal-content',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  @Output() updateCategory = new EventEmitter<any>();
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
  public url =  this.api.localhost + '/inventory/products/';
  public url2 =  this.api.localhost + '/inventory/products/${id}';

  productForm = new FormGroup({
    name: new FormControl(),
    quantity: new FormControl(),
    note: new FormControl(),
    brand: new FormControl(),
    unit: new FormControl(),
    category: new FormControl(),
    image: new FormControl(),
  });
  brand: any;
  unit: any;
  category: any;
  note: any;

  constructor(
    private modalService: NgbModal,
    public http: HttpClient,
    config: NgbModalConfig,
    public categoryService: CategoryService,
    public brandService: BrandService,
    public unitService: UnitService,
    public productService: ProductService,
    public fb: FormBuilder,
    public api: LocalhostApiService
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
      .getUnit()
      .subscribe((units) => (this.units = units.results));
  }

  // <-------------------------------------- CODE FOR GETTING BRAND ------------------------------------->

  getBrand() {
    this.brandService
      .getBrand(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.brands = data.results;
      });
  }

  // <-------------------------------------- CODE FOR GETTING UNIT ------------------------------------->

  getUnit() {
    this.unitService.getUnit().subscribe((data) => {
      this.units = data.results;
    });
  }

  // <-------------------------------------- CODE FOR GETTING CATEGORY ------------------------------------->

  getCategories() {
    this.categoryService
      .getCategories(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.categories = response.results;
      });
  }

  // <-------------------------------------- CODE FOR GETTING PRODUCTS ------------------------------------->

  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.productData1 = data.results;
    });
  }

  formData = {
    name: '',
    note: '',
    unit: '',
    brand: '',
    category: '',
    image: '',
  };

  productData!: {
    map(
      arg0: (
        product: {
          image: any;
          name: any;
          quantity: any;
          category: any;
          note: any;
          brand: any;
          unit: any;
        },
        index: number
      ) => {
        sn: number;
        title: any;
        address: any;
        balance: any;
        status: any;
        contact: any;
        email: any;
        unit: any;
      }
    ): unknown;
    name: any;

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

  // <-------------------------------------- CODE FOR ADDING PRODUCTS ------------------------------------->

  addProduct() {
    const productData = {
      name: this.productForm.get('name')?.value,
      note: this.productForm.get('note')?.value,
      brand: this.productForm.get('brand')?.value,
      unit: this.productForm.get('unit')?.value,
      category: this.productForm.get('category')?.value,
    };
    if (
      !this.name ||
      !this.note ||
      !this.brand ||
      !this.unit ||
      !this.category
    ) {
      Swal.fire({
        icon: 'error',
        title: 'please fill all the fields',
        text: 'please fill all the fields',
      });
    }
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
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
          note: '',
          brand: '',
          unit: '',
          category: '',
        };
        console.log(response);
        this.getProducts();
        this.productForm.reset();
        this.modalService.dismissAll();
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

  // <-------------------------------------- CODE FOR DELETING PRODUCTS ------------------------------------->

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

  open3(content3: any) {}

  // code for creating  pdf file

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

    const data = this.productData.map(
      (
        product: {
          image: any;
          name: any;
          quantity: any;
          category: any;
          note: any;
          brand: any;
          unit: any;
        },
        index: number
      ) => ({
        sn: index + 1,
        title: product.image,
        address: product.name,
        balance: product.quantity,
        status: product.category,
        contact: product.note,
        email: product.brand,
        unit: product.unit,
      })
    );

    const doc = new jsPDF();

    doc.text(columns2.title, 86, 8);
    doc.setFontSize(22);
    doc.setFontSize(16);
    (doc as any).autoTable({
      columns: columns,
      body: data,
    });
    doc.save('all_products.pdf');
  }
  name: any;

  //  code for searching products

  Search() {
    if (this.name == '') {
      this.ngOnInit();
    } else {
      this.productData1 = this.productData1.filter((res: { name: string }) => {
        return res.name.match(this.name);
      });
    }
  }

  updateProduct: any;
  update_product(product: any) {
    this.updateProduct = product;
  }
  product: any;

  onFileSelected2(event: any) {
    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);
  }

  //  code for updatting product

  update_product_Data() {
    const formData = new FormData();
    formData.append('name', this.productForm.get('name')?.value);
    formData.append('note', this.productForm.get('note')?.value);
    formData.append('brand', this.productForm.get('brand')?.value);
    formData.append('unit', this.productForm.get('unit')?.value);
    formData.append('category', this.productForm.get('category')?.value);
    if (this.selectedFile)
      formData.append('image', this.selectedFile, this.selectedFile.name);

    const url =
      this.api.localhost +
      `/inventory/products/${this.updateProduct?.id}/`;

    this.http.patch(url, formData).subscribe(
      (response) => {
        console.log(response);
        Swal.fire({
          title: 'Product updated',
          text: 'product updated successfully!',
          timer: 2000,
          icon: 'success',
        });
        this.getProducts();
        this.modalService.dismissAll();
        this.productForm.reset();
      },
      (error) => {
        console.log(error);
        
      }
    );
  }
  onPageChange(event: any) {
    this.currentPage = event;
    this.getUnit();
  }
  p: any;
  // pages: number[] = [];
}
