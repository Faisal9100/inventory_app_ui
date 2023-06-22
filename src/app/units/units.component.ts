import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { UnitService } from '../unit.service';
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
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
})
export class UnitsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  products: Product[] = [];
  Units: any = {};
  newCategory: any = {};
  modalService: any;
  totalUnits: number = 0;
  pageSize: any = 10;
  currentPage: number = 1;
  searchQuery: string = '';
  pageIndex: any = 0;
  selectedCategory: any;
  categoryService: any;
  id = 'pagination';
  totalPages: number = 1;
  totalItems: any;
  itemperPage: any;
  productData: any;

  constructor(
    public unitService: UnitService,
    public http: HttpClient,
    public productService: ProductService,
    public api: LocalhostApiService
  ) {}

  ngOnInit() {
    this.getProducts();

    this.getUnit();
  }

  // <===============================  CODE FOR GETTING PRODUCTS  ====================================>

  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.productData = data.results;
    });
  }
  // <===============================  CODE FOR GETTING UNITS  ====================================>

  getUnit() {
    this.unitService.getUnit().subscribe((response: any) => {
      this.Units = <any>response;
      this.addCount(this.Units);
    });
  }

  search() {
    this.searchBrand(this.searchTerm);
  }

  Unit1: any[] = [];
  searchTerm: any;
  // <===============================  CODE FOR SEARCHING UNITS  ====================================>

  searchBrand(searchTerm: any) {
    const searchUrl = this.url + '?search=' + searchTerm;
    this.http.get(searchUrl).subscribe(
      (res: any) => {
        this.Units = res;
        this.addCount(this.Units);
      },
      (error) => {
        console.error(error);
      }
    );
  }
  addCount(data: any) {
    let pageSize = 10;
    let pages = Math.ceil(data['count'] / pageSize);
    let nums: any[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    data['pages'] = nums;
    data['current'] = 1;
  }

  itemPerPage: number = 10;
  totalRecord: any;
  p: any;
  pages: number = 1;

  // <===============================  CODE FOR ADDING UNITS  ====================================>


  addUnit() {
    Swal.fire({
      title: 'Add New Unit',
      input: 'text',
      inputPlaceholder: 'Unit Name',
      showCancelButton: true,
      confirmButtonText: 'Add',
      showLoaderOnConfirm: true,
      preConfirm: (name) => {
        return new Promise((resolve, reject) => {
          if (!name) {
            // Check if Brand name is empty
            reject('unit name cannot be empty.'); // Reject the promise with an error message
          } else {
            const newCategory = { name: name };
            this.unitService.addUnit(newCategory).subscribe(
              (response) => {
                resolve(response);
                this.getUnit();
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
            title: 'Unit Added!',
            text: `The Unit has been added.`,
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

  // <===============================  CODE FOR DELETING UNITS  ====================================>

  deleteUnit(categoryId: string) {
    Swal.fire({
      icon: 'question',
      title: 'Are you sure you want to delete this Unit?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.unitService.deleteUnit(categoryId).toPromise();
      },
    })
      .then(() => {
        // Remove the deleted unit from the Units array

        Swal.fire({
          icon: 'success',
          title: 'Unit Deleted!',
          text: 'The Unit has been deleted.',
          showConfirmButton: true,
          timer: 1000,
        });
        this.getUnit();
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `An error occurred while deleting the Unit: ${error}`,
          showConfirmButton: true,
        });
      });
  }

  taskToEdit: any;

  public url = this.api.localhost + '/inventory/units/';


  // <======================  CODE FOR OPENING MODEL FOR UPDATING UNITS ===========================>
  
  openmodel(allcontent: any, newProduct: any) {
    this.modalService.open(allcontent);
    this.taskToEdit = newProduct;
  }
  
  // <===============================  CODE FOR UPDATING  UNITS  ====================================>

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
        product.name = updatedName;
        this.unitService.putProduct(product).subscribe(() => {
          console.log(`Product with ID ${product.id} updated successfully!`);
          this.getUnit();
          Swal.fire('Updated!', 'Your product has been updated.', 'success');
        });
      }
    });
  }
}
