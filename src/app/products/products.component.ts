import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  NgbActiveModal,
  NgbModal,
  NgbModalConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../category.service';
import { BrandService } from '../brand.service';
import { UnitService } from '../unit.service';
import { ProductService } from '../product.service';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

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

  public url = 'http://' + this.ip_address + '/inventory/products/';
  public url2 = 'http://' + this.ip_address + '/inventory/products/${id}';
  totalItems: any;
  itemsPerPage: any;
  products: Product[] = [];
  image: File[] = [];
  // categories: string[] = [];
  brands: { id: number; name: string }[] = [];
  categories: { id: number; name: string }[] = [];
  units: { id: number; name: string }[] = [];
  formBuilder: any;

  productForm = new FormGroup({
    name: new FormControl(),
    quantity: new FormControl(),
    note: new FormControl(),
    brand: new FormControl(),
    unit: new FormControl(),
    category: new FormControl(),
    image: new FormControl(),
  });
  // newProduct: { image: string; name: string; category: string; brand: string; stock: string; totalsale: string; alertqty: string; unit: string; };
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

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  productData1: any;

  selectedFile: any;
  productData!: {
    name: any;
    quantity: any;
    note: any;
    brand: any;
    unit: any;
    category: any;
    image: any;
  };
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

    console.log('FormData:', formData);

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
      },
      (error) => console.log(error),
      () => console.log('error adding product')
    );
  }
  id:any;
  deleteProduct(id: number): void {
    this.productService.deleteProduct(id).subscribe(() => {
      // Remove the deleted product from the products array
      this.products = this.products.filter((p) => p.id !== id);
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

  getBrand() {
    this.brandService
      .getBrand(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.brands = data.results;
      });
  }

  getUnit() {
    this.unitService
      .getUnit(this.pageIndex, this.pageSize)
      .subscribe((data) => {
        this.units = data.results;
      });
  }

  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.productData1 = data.results;
    });
  }
  getCategories() {
    this.categoryService
      .getCategories(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.categories = response.results;
      });
  }

  open(content:any) {
		this.modalService.open(content);
	}
}
