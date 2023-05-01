import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

export interface Supplier {
  id: number;
  title: string;
  address: string;
  balance: number;
  status: string;
  contact: number;
  email: string;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  public ip_address="192.168.1.9:8000";
  supplierToEdit: any;
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  id = 'pagination';
  closeResult: any;

  public url = "http://" + this.ip_address + "/inventory/customers/";
  totalItems: any;
  itemsPerPage: any;
  suppliers: any[] = [];
  supplier: Supplier = {
    id: 0,
    title: '',
    address: '',
    status: '',
    balance: 0,
    contact: 0,
    email: '',
  };
  constructor(private modalService: NgbModal, public http: HttpClient) {
    this.fetchsupplier();
  }
  ngOnInit(): void {
    this.fetchsupplier();
  }

  newsupplier = {
    title: '',
    address: '',
    balance: '',
    status: '',
    contact: '',
    email: '',
  };
  addSupplier() {
    Swal.fire({
      title: 'Add Customer',
      html: `
         <label>title:</label>
          <input type="text" id="supplierTitle" class="swal2-input" placeholder="Customer Title">
         
          <label>Address:</label>
          <input type="text" id="supplierAddress" class="swal2-input" placeholder="Customer Address ">
        
          <label>Balance:</label>
          <input type="number" id="supplierBalance" class="swal2-input" placeholder="Customer Balance">
          
          <label>Status:</label>
          
          <select id="supplierStatus" class="swal2-select">
        <option value="true">Enabled</option>
        <option value="false">Disabled</option>
      </select>
         
          <br><label>Contact:</label>
          <input type="number" id="supplierContact" class="swal2-input" placeholder="Customer Contact">
         
          <br><label>Email:</label>
          <input type="text" id="supplierEmail" class="swal2-input" placeholder="Customer Email">
         
        
          `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const supplierTitle = (<HTMLInputElement>(
          document.getElementById('supplierTitle')
        )).value;
        const supplierAddress = (<HTMLInputElement>(
          document.getElementById('supplierAddress')
        )).value;
        const supplierBalance = (<HTMLInputElement>(
          document.getElementById('supplierBalance')
        )).value;
        const supplierStatus = (<HTMLSelectElement>(
          document.getElementById('supplierStatus')
        )).value;
        const supplierContact = (<HTMLInputElement>(
          document.getElementById('supplierContact')
        )).value;
        const supplierEmail = (<HTMLInputElement>(
          document.getElementById('supplierEmail')
        )).value;

        if (!supplierTitle) {
          Swal.showValidationMessage('Customer title is required');
        } else {
          const newsupplier = {
            title: supplierTitle,
            address: supplierAddress,
            status: supplierStatus,
            balance: supplierBalance,
            email: supplierEmail,
            contact: supplierContact,
          };
          this.http.post<Supplier>(this.url, newsupplier).subscribe(() => {
            this.newsupplier = {
              title: '',
              address: '',
              balance: '',
              status: '',
              contact: '',
              email: '',
            };
            this.fetchsupplier();
            Swal.fire('Added!', 'Your Customer has been added.', 'success');
          });
        }
      },
    });
  }

  fetchsupplier() {
    let skip = (this.currentPage - 1) * this.pageSize;

    let limit = 20;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;

    this.http.get<any>(url).subscribe((response) => {
      this.suppliers = <any>response.results;
      this.totalPages = Math.ceil(response.count / this.pageSize);
      this.totalItems = response.count;

      this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
    });
  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.fetchsupplier();
  }
  deleteSupplier(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this Customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.url}${id}`).subscribe(() => {
          console.log(`Customer with ID ${id} deleted successfully!`);
          this.fetchsupplier();
          Swal.fire('Deleted!', 'Your Customer has been deleted.', 'success');
        });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your Customer is safe :)', 'info');
      }
    });
  }
  openmodel(allcontent: any, newsupplier: any) {
    this.modalService.open(allcontent);
    this.supplierToEdit = newsupplier;
  }
  openUpdateModal(supplier: Supplier) {
    Swal.fire({
      title: 'Update Supplier Detail',
      html: `
        <label>Title:</label>
        <input type="text" id="customerTitle" class="swal2-input swal1" placeholder="Customer Name"  value="${
          supplier.title
        }">
        
        <br><label>Address:</label>
        <input type="text" id="customerAddress" class="swal2-input swal2" placeholder="Customer Address"  value="${
          supplier.address
        }">
        
        <br><label>Balance:</label>
        <input type="number" id="customerBalance" class="swal2-input swal3" placeholder="Customer Balance"  value="${
          supplier.balance
        }">
        
        <label>Status:</label> 
        <select id="customerStatus" class="swal2-select">
          <option value="true" ${
            supplier.status ? 'selected' : ''
          }>Enabled</option>
          <option value="false" ${
            !supplier.status ? 'selected' : ''
          }>Disabled</option>
        </select>
        
        <br><label>Contact:</label>
        <input type="number" id="customerContact" class="swal2-input swal5" placeholder="Customer Contact"  value="${
          supplier.contact
        }">
        
        <br><label>Email:</label>
        <input type="text" id="customerEmail" class="swal2-input swal4" placeholder="Customer Email"  value="${
          supplier.email
        }">
      
      `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTitle = (<HTMLInputElement>(
          document.querySelector('.swal1')
        )).value;
        const updatedAddress = (<HTMLInputElement>(
          document.querySelector('.swal2')
        )).value;
        const updatedBalance = parseInt(
          (<HTMLInputElement>document.querySelector('.swal3')).value
        );

        const updatedContact = (<HTMLInputElement>(
          document.querySelector('.swal5')
        )).value;
        const updatedEmail = (<HTMLInputElement>(
          document.querySelector('.swal4')
        )).value;
        const updatedStatus =
          (<HTMLSelectElement>document.querySelector('.swal2-select')).value ===
          'true';

        this.http
          .put(`${this.url}${supplier.id}/`, {
            title: updatedTitle,
            address: updatedAddress,
            contact: updatedContact,
            email: updatedEmail,
            balance: updatedBalance,
            status: updatedStatus,
          })
          .subscribe(() => {
            console.log(
              `Customer with ID ${supplier.id} updated successfully!`
            );
            this.fetchsupplier();
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
    const columns2 = { title: 'All Customer List' };
    
    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'Title', dataKey: 'title' },
      { title: 'Address', dataKey: 'address' },
      { title: 'Balance', dataKey: 'balance' },
      { title: 'status', dataKey: 'status' },
      { title: 'Contact', dataKey: 'contact' },
      { title: 'Email', dataKey: 'email' },
    ];

    const data = this.suppliers.map((supplier, index) => ({
      sn: index + 1,
      title: supplier.title,
      address: supplier.address,
      balance: supplier.balance,
      status: supplier.status,
      contact: supplier.contact,
      email: supplier.email,
    }));
    
    const doc = new jsPDF();
    
    doc.text(columns2.title, 86, 8);
    doc.setFontSize(22);
    // doc.setTextColor('red');
    doc.setFontSize(16);

    (doc as any).autoTable({
      columns: columns,
      body: data,
    });
    doc.save('all_customers.pdf');
  }
}
