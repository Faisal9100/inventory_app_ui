import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

export interface Product {
  id: number;
  name: string;
  address: string;
  mobile: string;
  email: string;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  taskToEdit: any;
  currentPage = 1;
  pageSize = 10;
  id = 'pagination';
  totalPages!: number;
  pages: number[] = [];

  products: any[] = [];
  product: Product = { id: 0, name: '', address: '', mobile: '', email: '' };
  closeResult: any;

  public url = 'http://127.0.0.1:8000/inventory/customers/';
  totalItems: any;
  itemsPerPage: any;
  constructor(private modalService: NgbModal, public http: HttpClient) {
    this.fetchwarehouse();
  }
  ngOnInit(): void {
    this.fetchwarehouse();
  }

  newProduct = { name: '', address: '', mobile: '', email: '' };
  addProduct() {
    Swal.fire({
      title: 'Add Customer',
      html: `
        <label>Name:</label>
        <input type="text" id="productName" class="swal2-input" placeholder="Customer Name">
        <br><label>Address:</label>
        <input type="text" id="productAddress" class="swal2-input" placeholder="Customer Address ">
        <label>Mobile:</label>
        <input type="text" id="productMobile" class="swal2-input" placeholder="Customer Mobile">
       
        <label>Email:</label>
        <input type="text" id="productEmail" class="swal2-input" placeholder="Customer Email">
       
      
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
        const productMobile = (<HTMLSelectElement>(
          document.getElementById('productMobile')
        )).value;
        const productEmail = (<HTMLSelectElement>(
          document.getElementById('productEmail')
        )).value;

        if (!productName) {
          Swal.showValidationMessage('Customer name is required');
        } else {
          const newProduct = {
            name: productName,
            address: productAddress,
            mobile: productMobile,
            email: productEmail,
          };
          this.http.post<Product>(this.url, newProduct).subscribe(() => {
            this.newProduct = { name: '', address: '', mobile: '', email: '' };
            this.fetchwarehouse();
            Swal.fire('Added!', 'Your customer has been added.', 'success');
          });
        }
      },
    });
  }

  fetchwarehouse() {
    let skip = (this.currentPage - 1) * this.pageSize;

    let limit = 20;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;

    this.http.get<any>(url).subscribe((response) => {
      this.products = <any>response.results;
      this.totalPages = Math.ceil(response.count / this.pageSize);
      this.totalItems = response.count;

      this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
    });
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.fetchwarehouse();
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
          Swal.fire('Deleted!', 'Your customer has been deleted.', 'success');
        });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your customer is safe :)', 'info');
      }
    });
  }
  openmodel(allcontent: any, newProduct: any) {
    this.modalService.open(allcontent);
    this.taskToEdit = newProduct;
  }
  openUpdateModal(product: Product) {
    Swal.fire({
      title: 'Update Customer Detail',
      html: `
      <label>Name:</label>
      <input type="text" id="productName" class="swal2-input swal1" placeholder="Customer Name"  value="${product.name}">
      <br><label>Address:</label>
      <input type="text" id="productAddress" class="swal2-input swal2" placeholder="Customer Address"  value="${product.address}">
      <br><label>Address:</label>
      <input type="text" id="productMobile" class="swal2-input swal3" placeholder="Customer Mobile"  value="${product.mobile}">
      <br><label>Address:</label>
      <input type="text" id="productEmail" class="swal2-input swal4" placeholder="Customer Email"  value="${product.email}">
    

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
        const updatedMobile = (<HTMLInputElement>(
          document.querySelector('.swal3')
        )).value;
        const updatedEmail = (<HTMLInputElement>(
          document.querySelector('.swal4')
        )).value;
        this.http
          .put(`${this.url}${product.id}/`, {
            name: updatedName,
            address: updatedAddress,
            mobile: updatedMobile,
            email: updatedEmail,
          })
          .subscribe(() => {
            console.log(`Product with ID ${product.id} updated successfully!`);
            this.fetchwarehouse();
            Swal.fire(
              'Updated!',
              'Your Customer list has been updated.',
              'success'
            );
          });
      }
    });
  }
  // generatePDF() {
  //   const columns = [
  //     { title: 'S.N', dataKey: 'sn' },
  //     { title: 'Name', dataKey: 'name' },
  //     { title: 'Address', dataKey: 'address' },
  //     { title: 'Mobile', dataKey: 'mobile' },
  //     { title: 'Email', dataKey: 'email' },
  //     { title: 'Recievable', dataKey: 'recievable' },
  //     { title: 'Payable', dataKey: 'payable' },
  //   ];

  //   const data = this.products.map((product, index) => ({
  //     sn: index + 1,
  //     name: product.name,
  //     address: product.address,
  //     mobile: product.mobile,
  //     email: product.email,
  //     reciavable: product.reciavable,
  //     payable: product.payable,
  //   }));

  //   const doc = new jsPDF();

  //   doc.setFontSize(22);
  //   doc.setTextColor(0, 0, 0);
  //   doc.text('All Customers', 14, 22);

  //   (doc as any).autoTable({
  //     columns: columns,
  //     body: data,
  //   });
  //   doc.save('all_customers.pdf');
  // }
  generatePDF() {
    const columns2 = { title: 'All Customer' };
    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'Name', dataKey: 'name' },
      { title: 'Address', dataKey: 'address' },
      { title: 'Mobile', dataKey: 'mobile' },
      { title: 'Email', dataKey: 'email' },
      { title: 'Recievable', dataKey: 'recievable' },
      { title: 'Payable', dataKey: 'payable' },
    ];

    const data = this.products.map((product, index) => ({
      sn: index + 1,
      name: product.name,
      address: product.address,
      mobile: product.mobile,
      email: product.email,
      reciavable: product.reciavable,
      payable: product.payable,
    }));

    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.setTextColor(0, 0, 0);
    doc.text('All Customers', 50, 42);
    doc.setFontSize(16);

    (doc as any).autoTable({
      columns: columns,
      body: data,
    });
    doc.save('all_customers.pdf');
  }
}
