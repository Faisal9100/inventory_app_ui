import { Component, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { CategoryService } from '../category.service';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { ProductService } from '../product.service';
import { LocalhostApiService } from '../localhost-api.service';

export interface Product {
  serialNo: string;
  id: number;
  name: string;
  quantity: number;
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css'],
})
export class CategoriesComponent {
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;

  categories: any = {};
  newCategory: any = {};
  modalService: any;
  totalCategories: number = 0;
  pageSize: any = 10;
  currentPage: number = 1;
  searchQuery: string = '';
  pageIndex: any = 0;
  selectedCategory: any;
  productData: any;
  title?: string;

  constructor(
    private categoryService: CategoryService,
    private http: HttpClient,
    public productService: ProductService,
    public api:LocalhostApiService
  ) {}

  ngOnInit() {
    this.getProducts();
    this.getCategories();
  }
  getProducts() {
    this.categoryService.getProducts().subscribe((data) => {
      this.productData = data.results;
    });
  }
  
  // searchCategories(): void {
  //   this.pageIndex = 0;
  //   this.getCategories(this.pageIndex, this.pageSize);
  // }
  name: any;
  Search() {
    if (this.name == '') {
      this.ngOnInit();
    } else {
      this.categories = this.categories.filter((res:any) => {
        return res.name.match(this.name);
      });
    }
  }
  getCategories() {
  this.categoryService.getCategories().subscribe((res)=>{
    this.categories = res;
    this.addCount(this.categories);
  })
  }
  addCount(data: any) {
    let pageSize = 10;
    let pages = Math.ceil(data['count'] / pageSize);
    let nums: any[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    data['pages'] = nums;
    data['current'] = 1;
  }
 
  addCategory() {
    Swal.fire({
      title: 'Add New Category',
      input: 'text',
      inputPlaceholder: 'Category Name',
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        return new Promise((resolve, reject) => {
          if (!name) { // Check if category name is empty
            reject('Category name cannot be empty.'); // Reject the promise with an error message
          } else {
            const newCategory = { name: name };
            this.categoryService.addCategory(newCategory).subscribe(
              (response) => {
                resolve(response);
                this.getCategories();
              },
              (error) => {
                reject(error);
              }
            );
          }
        });
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          icon: 'success',
          title: 'Category Added!',
          text: `The category has been added.`,
          showConfirmButton: true,
          timer: 1500,
        });
      }
    }).catch((error) => { // Catch any error from the promise rejection
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error, // Display the error message
        showConfirmButton: true,
      });
    });
  }
  

  deleteCategory(categoryId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this category?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.categoryService.deleteCategory(categoryId).toPromise();
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.categories = this.categories.filter((category:any) => {
            return category.id !== categoryId;
          });

          Swal.fire({
            icon: 'success',
            title: 'Category Deleted!',
            text: `The category has been deleted.`,
            showConfirmButton: true,
            timer: 1000,
          });
        }
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `An error occurred while deleting the category: ${error}`,
          showConfirmButton: true,
        });
      });
  }
  taskToEdit: any;

  public url =  this.api.localhost +"/inventory/categories/";

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
            this.getCategories();
            Swal.fire('Updated!', 'Your product has been updated.', 'success');
          });
      }
    });
  }
  p: any;
  pageChanged(event: any) {
    this.currentPage = event;
    this.getCategories();

  }
}
