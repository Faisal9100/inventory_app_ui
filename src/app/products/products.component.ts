import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../category.service';
import { BrandService } from '../brand.service';
import { UnitService } from '../unit.service';
import { ProductService } from '../product.service';
// import Swal from 'sweetalert2';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

export interface Product {
  category: any;
  brand: any;
  unit: any;
  name: string;
  image: File;
  quantity: any;
  note: string;
}

@Component({
  selector: 'app-products',
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

  public url = 'http://127.0.0.1:8000/inventory/products/';
  public url2 = 'http://127.0.0.1:8000/inventory/products/${id}';
  totalItems: any;
  itemsPerPage: any;
  productData: any;
  products: Product[] = [];
  image: File[] = [];
  // categories: string[] = [];
  brands: { id: number; name: string }[] = [];
  categories: { id: number; name: string }[] = [];
  units: { id: number; name: string }[] = [];
  formBuilder: any;

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    quantity: new FormControl('', Validators.required),
    note: new FormControl('', Validators.required),
    brand: new FormControl('', Validators.required),
    unit: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    image: new FormControl(''),
  });
  // newProduct: { image: string; name: string; category: string; brand: string; stock: string; totalsale: string; alertqty: string; unit: string; };
  constructor(
    private modalService: NgbModal,
    public http: HttpClient,
    config: NgbModalConfig,
    public categoryService: CategoryService,
    public brandService: BrandService,
    public unitService: UnitService,
    public productService: ProductService
  ) {
    config.backdrop = 'static';
    config.keyboard = false;

    // this.category = this. categoryService.getCategories(this.pageIndex, this.pageSize);
  }

  // onFileSelected(event: any) {
  //   const file: File = event.target.files[0];
  //   if (file) {
  //     const fileValue = new File([file], file.name, { type: file.type });
  //     const inputElement = event.target as HTMLInputElement;
  //     inputElement.value = ''; // Clear the input value
  //     const fileList = new FileList;
  //     inputElement.files = fileList;
  //     this.productForm.get('image')?.setValue(fileValue as any);
  //   }
  // }

  // onSubmit() {
  //   const product = this.productForm.value as unknown as Product;

  //   const formData = new FormData();
  //   formData.append('name', product.name);
  //   formData.append('quantity', product.quantity);
  //   formData.append('note', product.note);
  //   formData.append('brand', product.brand);
  //   formData.append('unit', product.unit);
  //   formData.append('category', product.category);

  //   const fileInput = this.productForm.get('file');
  //   if (fileInput && fileInput.value && <any>fileInput.value instanceof File) {
  //     formData.append('file', fileInput.value);
  //   }

  //   this.productService.addProduct(formData).subscribe(
  //     (response) => console.log(response),
  //     (error) => console.log(error)
  //   );

  //   this.productForm.reset();

  //   console.log(product);
  // }

  // onSubmit() {
  //   const product = this.productForm.value as unknown as Product;

  //   const formData = new FormData();
  //   formData.append('name', product.name);
  //   formData.append('quantity', product.quantity);
  //   formData.append('note', product.note);
  //   formData.append('brand', product.brand);
  //   formData.append('unit', product.unit);
  //   formData.append('category', product.category);
  //   this.productService.addProduct(formData).subscribe(
  //     (response) => console.log(response),
  //     (error) => console.log(error)
  //   );

  //   this.productForm.reset();

  //   console.log(product);
  // }
  // onSubmit() {
  //   const product = this.productForm.value as unknown as Product;
  //   console.log(product)

  //   const formData = new FormData();
  //   formData.append('name', product.name);
  //   formData.append('quantity', product.quantity);
  //   formData.append('note', product.note);
  //   formData.append('brand', product.brand);
  //   formData.append('unit', product.unit);
  //   formData.append('category', product.category);

  //   // Get the first image if it is defined
  //   const image = this.productForm.get('image') as AbstractControl;
  //   if (image && image.value) {
  //     const file = image.value[0];
  //     formData.append('image', file,file.value);
  //   }

  //   this.productService.addProduct(formData).subscribe(
  //     (response) => console.log(response),
  //     (error) => console.log(error)
  //   );

  //   this.productForm.reset();

  //   console.log(product);
  // }

  addProduct() {
    const product = this.productForm.value as unknown as Product;
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('quantity', product.quantity);
    formData.append('note', product.note);
    formData.append('brand', product.brand);
    formData.append('unit', product.unit);
    formData.append('category', product.category);

    const image = this.productForm.get('image') as AbstractControl;
    if (image && image.value && image.value.length > 0) {
      const file = image.value[0];
      if (
        file.type === 'image/jpeg' ||
        file.type === 'image/jpg' ||
        file.type === 'image/png'
      ) {
        formData.append('image', file, file.name);
      } else {
        this.productForm.controls['image'].setErrors({ invalidFileType: true });
        return;
      }
    }

    this.productService.addProduct(formData).subscribe(
      (response) => {
        console.log(response);
        this.productService.getProducts();
        this.categoryService.getCategories(this.pageIndex, this.pageSize);
        this.brandService.getBrand(this.pageIndex, this.pageSize);
        this.unitService.getUnit(this.pageIndex, this.pageSize);
      },
      (error) => console.log(error),
      () => console.log('error adding product')
    );
  }

  // onSubmit() {
  //   const product = this.productForm.value as unknown as Product;

  //   const formData = new FormData();
  //   formData.append('name', product.name);
  //   formData.append('quantity', product.quantity);
  //   formData.append('note', product.note);
  //   formData.append('brand', product.brand);
  //   formData.append('unit', product.unit);
  //   formData.append('category', product.category);
  //   formData.append('file', this.productForm.get<any>(this.image)?.value);

  //   this.productService.addProduct(formData).subscribe(
  //     (response) => console.log(response),
  //     (error) => console.log(error)
  //   );

  //   this.productForm.reset();

  //   console.log(product);
  // }

  // onSubmit() {
  //   const product = this.productForm.value as unknown as Product;
  //   this.productService.addProduct(product)
  //     .subscribe(
  //       response => console.log(response),
  //       error => console.log(error)
  //     );
  //     this.productForm.get('image')?.setValue(File);
  //   this.productForm.reset();
  //   console.log(product)

  // }

  // addProduct(): void {
  //   // make sure the required fields are properly initialized
  //   // if (!this.branddata || !this.branddata.id) {
  //   //   console.error('Brand is required.');
  //   //   return;
  //   // }
  //   // if (!this.category || !this.category.id) {
  //   //   console.error('Category is required.');
  //   //   return;
  //   // }
  //   // if (!this.selectedImage) {
  //   //   console.error('Image is required.');
  //   //   return;
  //   // }
  //   // if (!this.unitData || !this.unitData.id) {
  //   //   console.error('Unit is required.');
  //   //   return;
  //   // }

  //   // add the new brand, unit, and category if they don't already exist
  //   if (this.branddata.id) {
  //     this.brandService.createBrand(this.branddata.name,this.branddata.id).subscribe((response) => {
  //       this.branddata.id = response;
  //     });
  //   }
  //   if (!this.category.id) {
  //     this.categoryService.createCategory(this.category.name,this.category.id).subscribe((response) => {
  //       this.category.id = response;
  //     });
  //   }
  //   if (!this.unitData.id) {
  //     this.unitService.createUnit(this.unitData.name,this.category.id).subscribe((response) => {
  //       this.unitData.id = response;
  //     });
  //   }

  //   // create a new FormData object to submit the product data and image file
  //   const formData = new FormData();
  //   formData.append('brand', this.branddata.id.toString());
  //   formData.append('category', this.category.id.toString());
  //   formData.append('image', this.selectedImage);
  //   formData.append('unit', this.unitData.id.toString());
  //   formData.append('name', this.product.name);
  //   formData.append('quantity', this.product.quantity.toString());
  //   formData.append('note', this.product.note);

  //   // call the productService to add the new product
  //   this.productService.addProduct(formData).subscribe(
  //     (response) => {
  //       console.log('Product added successfully.');
  //       console.log(response);

  //       // refresh the product list and other data as needed
  //       this.getBrand();
  //       this.getCategories();
  //       this.getProducts();
  //       this.getUnit();
  //     },
  //     (error) => {
  //       console.error('Failed to add product.');
  //       console.error(error);
  //     }
  //   );
  // }

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
      this.productData = data.results;
    });
  }
  getCategories() {
    this.categoryService
      .getCategories(this.pageIndex, this.pageSize)
      .subscribe((response) => {
        this.categories = response.results;
      });
  }
  // selectedFile: File = new File([], '');

  open(content: any) {
    this.modalService.open(content);
  }
  // newProduct:any[]=[];
  // addProduct() {
  //   const productName = (<HTMLInputElement>(
  //     document.getElementById('productName')
  //   )).value;
  //   const productImage = (<HTMLInputElement>(
  //     document.getElementById('productImage')
  //   )).value;
  //   const productQuantity = (<HTMLInputElement>(
  //     document.getElementById('productQuantity')
  //   )).value;
  //   const productNote = (<HTMLInputElement>(
  //     document.getElementById('productNote')
  //   )).value;
  //   const productCategory = (<HTMLSelectElement>(
  //     document.getElementById('productCategory')
  //   )).value;
  //   const productBrand = (<HTMLSelectElement>(
  //     document.getElementById('productBrand')
  //   )).value;
  //   const productUnit = (<HTMLSelectElement>(
  //     document.getElementById('productUnit')
  //   )).value;

  //   if (!productName) {
  //     alert('Product name is required');
  //     return;
  //   }

  //   const newProduct = {
  //     name: productName,
  //     image: productImage,
  //     quantity: parseInt(productQuantity),
  //     note: productNote,
  //     category: parseInt(productCategory),
  //     brand: parseInt(productBrand),
  //     unit: parseInt(productUnit),
  //   };

  //   this.http.post<any>(this.url, newProduct).subscribe(
  //     (response) => {
  //       this.newProduct = {
  //         name: '',
  //         image: '',
  //         quantity: '',
  //         note: '',
  //         category: '',
  //         brand: '',
  //         unit: '',
  //       };
  //       this.getProducts();
  //       alert('Your product has been added.');
  //     },
  //     (error) => {
  //       console.error(error);
  //       alert('Failed to add product.');
  //     }
  //   );
  // }

  // fetchwarehouse() {
  //   let skip = (this.currentPage - 1) * this.pageSize;
  //   let limit = this.pageSize;
  //   let url = `${this.url}?skip=${skip}&limit=${limit}`;

  //   this.http.get<any>(url).subscribe((response) => {
  //     this.products = <any>response.results;
  //     this.totalPages = Math.ceil(response.count / this.pageSize);
  //     this.totalItems = response.count; // add this line to update the totalItems

  //     this.currentPage = 1;
  //     this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  //     this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
  //   });
  // }

  // deleteProduct(id: number) {
  //   Swal.fire({
  //     title: 'Are you sure?',
  //     text: 'You will not be able to recover this product!',
  //     icon: 'warning',
  //     showCancelButton: true,
  //     confirmButtonColor: '#dc3545',
  //     confirmButtonText: 'Yes, delete it!',
  //     cancelButtonText: 'No, cancel',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       this.http.delete(`${this.url}${id}`).subscribe(() => {
  //         console.log(`Product with ID ${id} deleted successfully!`);
  //         this.fetchwarehouse();
  //         Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
  //       });
  //     } else if (result.isDenied) {
  //       Swal.fire('Cancelled', 'Your product is safe :)', 'info');
  //     }
  //   });
  // }
  // openmodel(allcontent: any, newProduct: any) {
  //   this.modalService.open(allcontent);
  //   this.taskToEdit = newProduct;
  // }
}
