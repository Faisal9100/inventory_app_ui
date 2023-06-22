import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { BrandService } from '../brand.service';
import { ProductService } from '../product.service';
import { LocalhostApiService } from '../localhost-api.service';

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
  brands: any = {};
  newCategory: any = {};
  modalService: any;
  totalCategories: number = 0;
  pageSize: any = 10;
  currentPage: number = 1;
  searchQuery: string = '';
  pageIndex: any = 0;
  selectedCategory: any;
  productData: any;

  constructor(
    private brandService: BrandService,
    private http: HttpClient,
    public productService: ProductService,
    public api: LocalhostApiService
  ) {}

  ngOnInit() {
    this.getProducts();
    this.getBrand();
  }

  addCount(data: any) {
    let pageSize = 10;
    let pages = Math.ceil(data['count'] / pageSize);
    let nums: any[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    data['pages'] = nums;
    data['current'] = 1;
  }

  // <===============================  CODE FOR GETTING PRODUCTS  ====================================>

  getProducts() {
    this.brandService.getProducts().subscribe((data) => {
      this.productData = data.results;
    });
  }

  // <===============================  CODE FOR SEARCHING BRANDS  ====================================>

  search() {
    this.searchBrand(this.searchTerm);
  }
  searchTerm: any;
  showNoRecordsFound: boolean = false;

  searchBrand(searchTerm: any) {
    const searchUrl = this.url + '?search=' + searchTerm;
    this.http.get(searchUrl).subscribe(
      (res: any) => {
        this.brands = res;
        this.addCount(this.brands);
        this.showNoRecordsFound = (this.brands.length === 0);
      },
      (error) => {
        console.error(error);
        this.showNoRecordsFound = true;
      }
    );
  }
  

  // <===============================  CODE FOR GETTING  BRANDS  ====================================>

  getBrand() {
    this.brandService.getBrand().subscribe(
      (res: any) => {
        this.brands = res;
        this.addCount(this.brands);
        this.showNoRecordsFound = (this.brands.length === 0);
      },
      (error) => {
        console.error(error);
        this.showNoRecordsFound = true;
      }
    );
  }
  

  // <===============================  CODE FOR ADDING BRANDS  ====================================>


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
          if (!name) {
            // Check if Brand name is empty
            reject('Brand name cannot be empty.'); // Reject the promise with an error message
          } else {
            const newCategory = { name: name };
            this.brandService.addBrand(newCategory).subscribe(
              (response) => {
                resolve(response);
                this.getBrand();
              },
              (error) => {
                reject(error);
              }
            );
          }
        });
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            icon: 'success',
            title: 'Brand Added!',
            text: `The Brand has been added.`,
            showConfirmButton: true,
            timer: 1500,
          });
        }
      })
      .catch((error) => {
        // Catch any error from the promise rejection
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error, // Display the error message
          showConfirmButton: true,
        });
      });
  }

  // <===============================  CODE FOR DELETING BRANDS  ====================================>


  deleteBrand(categoryId: string) {
    Swal.fire({
      icon: 'question',
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
          if (Array.isArray(this.brands)) {
            // Update the brands array after successful deletion
            this.brands = this.brands.filter((brand: any) => {
              return brand.id !== categoryId;
            });
          }

          Swal.fire({
            icon: 'success',
            title: 'Brand Deleted!',
            text: 'The brand has been deleted.',
            showConfirmButton: true,
            timer: 1000,
          });
        }
        this.getBrand();
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

  public url = this.api.localhost + '/inventory/brands/';


  // <==========================  CODE FOR OPENING MODEL FOR UPDATING BRANDS  ===============================>

  openmodel(allcontent: any, newProduct: any) {
    this.modalService.open(allcontent);
    this.taskToEdit = newProduct;
  }

  // <==========================  CODE  FOR UPDATING BRANDS  ===============================>


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
            this.getBrand();
            Swal.fire('Updated!', 'Your product has been updated.', 'success');
          });
      }
    });
  }
}
