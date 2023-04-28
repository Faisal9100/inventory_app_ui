import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

export interface Supplier {
  id: number;
  name: string;
  address: string;
  company: string;
  mobile: number;
  email: string;
}
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent {
  supplierToEdit : any;
  pageSize = 10;
  currentPage = 1;
  totalPages !: number;
  pages : number[] = [];
  id = 'pagination';
  closeResult : any;
  
  public url = 'http://127.0.0.1:8000/inventory/Suppliers/';
  totalItems : any;
  itemsPerPage : any;
  suppliers : any[] = [];
  supplier : Supplier = {
    id: 0,
    name: '',
    address: '',
    company: '',
    mobile: 0,
    email: '',
  };
  constructor(private modalService: NgbModal, public http: HttpClient) {
    this.fetchsupplier();
  }
  ngOnInit(): void {
    this.fetchsupplier();
  }

  newsupplier = { name: '', address: '', company: '', mobile: '', email: '' };
  addSupplier() {
    Swal.fire({
      title: 'Add Supplier',
      html: `
          <label>Name:</label>
          <input type="text" id="supplierName" class="swal2-input" placeholder="Supplier Name">
          <br><label>Address:</label>
          <input type="text" id="supplierAddress" class="swal2-input" placeholder="Supplier Address ">
          <label>Company:</label>
          <input type="text" id="supplierCompany" class="swal2-input" placeholder="Supplier Company">
         
          <label>Mobile:</label>
          <input type="text" id="supplierMobile" class="swal2-input" placeholder="Supplier Mobile">
         
          <label>Email:</label>
          <input type="text" id="supplierEmail" class="swal2-input" placeholder="Supplier Email">
         
        
          `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const supplierName = (<HTMLInputElement>(
          document.getElementById('supplierName')
        )).value;
        const supplierAddress = (<HTMLInputElement>(
          document.getElementById('supplierAddress')
        )).value;
        const supplierMobile = (<HTMLSelectElement>(
          document.getElementById('supplierMobile')
        )).value;
        const supplierEmail = (<HTMLSelectElement>(
          document.getElementById('supplierEmail')
        )).value;
        const supplierCompany = (<HTMLSelectElement>(
          document.getElementById('supplierCompany')
        )).value;

        if (!supplierName) {
          Swal.showValidationMessage('Supplier name is required');
        } else {
          const newsupplier = {
            name: supplierName,
            address: supplierAddress,
            mobile: supplierMobile,
            email: supplierEmail,
            company: supplierCompany,
          };
          this.http.post<Supplier>(this.url, newsupplier).subscribe(() => {
            this.newsupplier = {
              name: '',
              address: '',
              company: '',
              mobile: '',
              email: '',
            };
            this.fetchsupplier();
            Swal.fire('Added!', 'Your Supplier has been added.', 'success');
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
      text: 'You will not be able to recover this supplier!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`${this.url}${id}`).subscribe(() => {
          console.log(`supplier with ID ${id} deleted successfully!`);
          this.fetchsupplier();
          Swal.fire('Deleted!', 'Your customer has been deleted.', 'success');
        });
      } else if (result.isDenied) {
        Swal.fire('Cancelled', 'Your Supplier is safe :)', 'info');
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
        <label>Name:</label>
        <input type="text" id="supplierName" class="swal2-input swal1" placeholder="Supplier Name"  value="${supplier.name}">
        <br><label>Address:</label>
        <input type="text" id="supplierAddress" class="swal2-input swal2" placeholder="Supplier Address"  value="${supplier.address}">
        <br><label>Company:</label>
        <input type="text" id="supplierCompany" class="swal2-input swal3" placeholder="Supplier Mobile"  value="${supplier.mobile}">
        <br><label>Email:</label>
        <input type="text" id="supplierEmail" class="swal2-input swal4" placeholder="Supplier Email"  value="${supplier.email}">
      
        <br><label>Mobile:</label>
        <input type="text" id="supplierMobile" class="swal2-input swal5" placeholder="Supplier Email"  value="${supplier.email}">
      
  
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
        const updatedCompany = (<HTMLInputElement>(
          document.querySelector('.swal4')
        )).value;
        this.http
          .put(`${this.url}${supplier.id}/`, {
            name: updatedName,
            address: updatedAddress,
            mobile: updatedMobile,
            email: updatedEmail,
            company: updatedCompany,
          })
          .subscribe(() => {
            console.log(`supplier with ID ${supplier.id} updated successfully!`);
            this.fetchsupplier();
            Swal.fire(
              'Updated!',
              'Your Supplier list has been updated.',
              'success'
            );
          });
      }
    });
  }
}
