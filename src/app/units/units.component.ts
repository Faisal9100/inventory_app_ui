import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { UnitService } from '../unit.service';
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
  selector: 'app-units',
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css'],
})
export class UnitsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  products: Product[] = [];
  Units: any[] = [];
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

  constructor(public unitService: UnitService, public http: HttpClient, public productService:ProductService) {}

  ngOnInit() {
    this.getProducts();
    this.getUnit(this.pageIndex, this.pageSize);
  
  }
  getProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.productData = data.results;
    });
    console.log(this.productData)
  }
  searchUnits(): void {
    this.pageIndex = 0;
    this.getUnit(this.pageIndex, this.pageSize);
  }
  getUnit(pageIndex: number, pageSize: number) {
    let limit = 20;
    if (this.searchQuery.trim() === '') {
      this.unitService.getUnit(pageIndex, pageSize).subscribe((response) => {
        this.Units = response.results;
        this.totalUnits = response.count;
      });
    } else {
      this.unitService.searchUnit(this.searchQuery).subscribe((response) => {
        this.Units = response.results;
        this.totalPages = Math.ceil(response.count / this.pageSize);
        this.totalItems = response.count;
        let skip = (this.currentPage - 1) * this.pageSize;

        this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
      });
    }
  }
  onPageChange(event: any) {
    this.currentPage = event;
    this.getUnit(this.pageIndex, this.pageSize);
  }
  pages: number[] = [];
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
          const newCategory = { name: name };
          this.unitService.addUnit(newCategory).subscribe(
            (response) => {
              resolve(response);
              this.getUnit(this.pageIndex, this.pageSize);
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
          title: 'Unit Added!',
          text: `The Unit has been added.`,
          showConfirmButton: true,
          timer: 1500,
        });
      }
    });
  }

  deleteUnit(categoryId: string) {
    Swal.fire({
      title: 'Are you sure you want to delete this Unit?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return this.unitService.deleteUnit(categoryId).toPromise();
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          this.Units = this.Units.filter((category) => {
            return category.id !== categoryId;
          });

          Swal.fire({
            icon: 'success',
            title: 'Unit Deleted!',
            text: `The Unit has been deleted.`,
            showConfirmButton: true,
            timer: 1000,
          });
        }
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
public ip_address= "192.168.1.9:8000";
  public url = "http://" + this.ip_address +"/inventory/Units/";

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
        product.name = updatedName;
        this.unitService.putProduct(product).subscribe(() => {
          console.log(`Product with ID ${product.id} updated successfully!`);
          this.getUnit(this.pageIndex, this.pageSize);
          Swal.fire('Updated!', 'Your product has been updated.', 'success');
        });
      }
    });
  }

  
}
