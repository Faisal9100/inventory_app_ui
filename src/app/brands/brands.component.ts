import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { BrandService } from '../brand.service';
import { ProductService } from '../product.service';

export interface Product {
  serialNo: string;
  id: number;
  name: string;
  category: any;
  brand: any;
  unit: any;
  image: File;
  quantity: any;
  note: string;
}

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
})
export class BrandsComponent {
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  public ip_address="127.0.0.1:8000";
  brands: any[] = [];
  newCategory: any = {};
  modalService: any;
  totalCategories: number = 0;
  pageSize: any = 10;
  currentPage: number = 1;
  searchQuery: string = '';
  pageIndex: any = 0;
  selectedCategory: any;
  productData:any;

  constructor(private brandService: BrandService, private http: HttpClient,public productService:ProductService) {}

  ngOnInit() {
    this.getProducts();
    this.getBrand(this.pageIndex, this.pageSize);
  }
  getProducts() {
    this.brandService.getProducts().subscribe((data) => {
      this.productData = data.results;
    });
   
  }
  searchBrand(): void {
    this.pageIndex = 0;
    this.getBrand(this.pageIndex, this.pageSize);
  }
  getBrand(pageIndex: number, pageSize: number) {
    if (this.searchQuery.trim() === '') {
      this.brandService.getBrand(pageIndex, pageSize).subscribe((response) => {
        this.brands = response.results;
        this.totalCategories = response.count;
      });
    } else {
      this.brandService.searchBrand(this.searchQuery).subscribe((response) => {
        this.brands = response.results;
        this.totalCategories = response.count;
      });
    }
  }
  pageChanged(event: any): void {
    const pageIndex = event.pageIndex;
    const pageSize = event.pageSize;
    this.getBrand(pageIndex, pageSize);
  }

  addBrand() {
    Swal.fire({
      title: 'Add New Brand',
      input: 'text',
      inputPlaceholder: 'Brand Name',
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        return new Promise((resolve, reject) => {
          const newCategory = { name: name };
          this.brandService.addBrand(newCategory).subscribe(
            (response) => {
              resolve(response);
              this.getBrand(this.pageIndex, this.pageSize);
            },
            (error) => {
              reject(error);
            }
          );
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: `The brand has been added.`,
          showConfirmButton: true,
          timer: 1500,
        });
      }
    });
  }

  deleteBrand(categoryId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this brand?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.brandService.deleteBrand(categoryId).toPromise();
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.brands = this.brands.filter((brand) => {
            return brand.id !== categoryId;
          });

          Swal.fire({
            icon: 'success',
            title: 'Brand Deleted!',
            text: `The brand has been deleted.`,
            showConfirmButton: true,
            timer: 1000,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `An error occurred while deleting the brand: ${error}`,
          showConfirmButton: true,
        });
      });
  }
  taskToEdit: any;

  public url = "http://" + this.ip_address +"/inventory/brands/";

  openmodel(allcontent: any, newProduct: any) {
    this.modalService.open(allcontent);
    this.taskToEdit = newProduct;
  }
  openUpdateModal(product: Product) {
    Swal.fire({
      title: 'Update Product',
      html: `
      <input type="text" class="swal2-input" placeholder="Enter new name" value="${product.name}">
    `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedName = (<HTMLInputElement>(
          document.querySelector('.swal2-input')
        )).value;
        this.http
          .put(`${this.url}${product.id}/`, { name: updatedName })
          .subscribe(() => {
            console.log(`Product with ID ${product.id} updated successfully!`);
            this.getBrand(this.pageIndex, this.pageSize);
            Swal.fire('Updated!', 'Your product has been updated.', 'success');
          });
      }
    });
  }
}
