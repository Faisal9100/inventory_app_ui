import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import 'jspdf-autotable';
import jsPDF from  'jspdf';
export interface Product {
  id: number;
  name: string;
  address: string;
  status: string;
}

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.css'],
})
export class WarehouseComponent {
  taskToEdit: any;
  currentPage = 1;
  pageSize = 10;
  totalPages = 0;
  pages: number[] = [];
  products: any[] = [];
  product: Product = { id: 0, name: '', address: '', status: '' };
  closeResult: any;

  public url = 'http://127.0.0.1:8000/inventory/warehouses/';
  constructor(private modalService: NgbModal, public http: HttpClient) {
    this.fetchwarehouse();
  }
  ngOnInit(): void {
    this.fetchwarehouse();
  }

  newProduct = { name: '', address: '', status: '' };
  addProduct() {
    Swal.fire({
      title: 'Add Warehouse',
      html: `
      <label>Name:</label>
      <input type="text" id="productName" class="swal2-input" placeholder="Warehouse Name">
      <br><label>Address:</label>
      <input type="text" id="productAddress" class="swal2-input" placeholder="Warehouse Address">
      <label>Status:</label>
      <select id="productStatus" class="swal2-select">
        <option value="1">Enabled</option>
        <option value="0">Disabled</option>
      </select>
    
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const productName = (<HTMLInputElement>(
          document.getElementById('productName')
        )).value;
        const productAddress = (<HTMLInputElement>(
          document.getElementById('productAddress')
        )).value;
        const productStatus = (<HTMLSelectElement>(
          document.getElementById('productStatus')
        )).value;

        if (!productName) {
          Swal.showValidationMessage('Product name is required');
        } else {
          const newProduct = {
            name: productName,
            address: productAddress,
            status: productStatus,
          };
          this.http.post<Product>(this.url, newProduct).subscribe(() => {
            this.newProduct = { name: '', address: '', status: '' };
            this.fetchwarehouse();
            Swal.fire('Added!', 'Your product has been added.', 'success');
          });
        }
      },
    });
  }

  // fetchwarehouse() {
  //   let skip = (this.currentPage - 1) * this.pageSize;
  //   let limit = this.pageSize;
  //   let url = `${this.url}?skip=${skip}&limit=${limit}`;

  //   this.http.get<any>(url).subscribe((response) => {
  //     this.products = <any>response.results;
  //     this.totalPages = Math.ceil(response.count / this.pageSize);

  //     // Update the pages array based on the total number of pages
  //     this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  //   });
  // }
  fetchwarehouse() {
    let skip = (this.currentPage - 1) * this.pageSize;
    let limit = this.pageSize;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;

    this.http.get<any>(url).subscribe((response) => {
      this.products = <any>response.results;
      this.totalPages = Math.ceil(response.count / this.pageSize);
      this.totalPages = Math.ceil(response.count / this.pageSize);
      this.currentPage = 1;
      this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
      this.pages = [];
      for (let i = 1; i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    });
  }

  deleteProduct(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.url}${id}`).subscribe(() => {
          console.log(`Product with ID ${id} deleted successfully!`);
          this.fetchwarehouse();
          Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
        });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your product is safe :)', 'info');
      }
    });
  }
  openmodel(allcontent: any, newProduct: any) {
    this.modalService.open(allcontent);
    this.taskToEdit = newProduct;
  }
  openUpdateModal(product: Product) {
    Swal.fire({
      title: 'Update Warehouse',
      html: `
      <label>Name:</label>
      <input type="text" id="productName" class="swal2-input swal1" placeholder="Name"  value="${
        product.name
      }">
      <br><label>Address:</label>
      <input type="text" id="productAddress" class="swal2-input swal2" placeholder="Address"  value="${
        product.address
      }">
      <label>Status:</label>
      <select id="productStatus" class="swal2-select">
        <option value="1" ${
          product.status == '1' ? 'selected' : ''
        }>Enabled</option>
        <option value="0" ${
          product.status == '0' ? 'selected' : ''
        }>Disabled</option>
      </select>
      
    `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedName = (<HTMLInputElement>document.querySelector('.swal1'))
          .value;
        const updatedAddress = (<HTMLInputElement>(
          document.querySelector('.swal2')
        )).value;
        const updatedStatus = (<HTMLInputElement>(
          document.querySelector('.swal2-select')
        )).value;
        this.http
          .put(`${this.url}${product.id}/`, {
            name: updatedName,
            address: updatedAddress,
            status: updatedStatus,
          })
          .subscribe(() => {
            console.log(`Product with ID ${product.id} updated successfully!`);
            this.fetchwarehouse();
            Swal.fire(
              'Updated!',
              'Your warehouse has been updated.',
              'success'
            );
          });
      }
    });
  }
  generatePDF() {
    // Define the columns for the table
    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Address', dataKey: 'address' },
      { title: 'Status', dataKey: 'status' },
    ];

    // Map the data to an array of objects
    const data = this.products.map((product, index) => ({
      sn: index + 1,
      name: product.name,
      address: product.address,
      status: product.status === '1' ? 'Enabled' : 'Disabled',
    }));

    // Create a new instance of jsPDF
    const doc = new jsPDF(); // Add .default.jsPDF()

    // Add the title to the PDF
    doc.setFontSize(22);
    doc.text('All Warehouses', 14, 22);

    // Add the table to the PDF
    (doc as any).autoTable({
      // Declare doc as any
      columns: columns,
      body: data,
    });

    // Save the PDF
    doc.save('all_warehouses.pdf');
  }
}
