import { SupplierService } from './../supplier.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { LocalhostApiService } from '../localhost-api.service';

export interface Supplier {
  id: number;
  title: string;
  address: string;
  balance: number;
  status: string;
  contact: number;
  email: string;
  credit: number;
  debit: number;
}
@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
})
export class SupplierComponent {
  supplierToEdit: any;
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  totalItems: any;
  itemsPerPage: any;
  id = 'pagination';
  closeResult: any;

  public url = this.api.localhost + '/inventory/Suppliers/';
  suppliers: any = {};
  supplier: Supplier = {
    id: 0,
    title: '',
    address: '',
    status: '',
    balance: 0,
    contact: 0,
    email: '',
    credit: 0,
    debit: 0,
  };
  constructor(
    private modalService: NgbModal,
    public http: HttpClient,
    public supplierService: SupplierService,
    public api: LocalhostApiService
  ) {
    this.getsupplier();
  }
  ngOnInit(): void {
    this.getsupplier();

  }

  newsupplier = {
    title: '',
    address: '',
    status: '',
    contact: '',
    email: '',
  };

  // <========================== CODE FOR ADDING SUPPLIER ====================================>

  addSupplier() {
    Swal.fire({
      title: 'Add Supplier',
      html: `
         <div class="form-group">
        <label for="supplierTitle" class="float-start my-2">Title:</label>
        <input type="text" id="supplierTitle" class="form-control" placeholder="Supplier Name" >
      </div>
      
      <div class="form-group">
        <label for="supplierAddress" class="float-start my-2">Address:</label>
        <input type="text" id="supplierAddress" class="form-control" placeholder="Supplier Address" >
      </div>
      
  
      <div class="form-group">
        <label for="supplierStatus" class="float-start my-2">Status:</label> 
        <select id="supplierStatus" class="form-select">
          <option value="true"}>Enabled</option>
          <option value="false"}>Disabled</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="supplierContact" class="float-start my-2">Contact:</label>
        <input type="number" id="supplierContact" class="form-control" placeholder="Supplier Contact">
      </div>
      
      <div class="form-group">
        <label for="supplierEmail" class="float-start my-2">Email:</label>
        <input type="email" id="supplierEmail" class="form-control" placeholder="Supplier Email" >
      </div>
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
          Swal.showValidationMessage('Supplier Title is required');
        }
        if (!supplierContact) {
          Swal.showValidationMessage('Supplier Contact is required');
        }
        if (!supplierAddress) {
          Swal.showValidationMessage('Supplier Address is required');
        }
        if (!supplierEmail) {
          Swal.showValidationMessage('Supplier Email is required');
        } else {
          const newsupplier = {
            title: supplierTitle,
            address: supplierAddress,
            status: supplierStatus,
            contact: supplierContact,
            email: supplierEmail,
          };
          this.http.post<Supplier>(this.url, newsupplier).subscribe(() => {
            this.newsupplier = {
              title: '',
              address: '',
              status: '',
              contact: '',
              email: '',
            };
            this.getsupplier();
            Swal.fire('Added!', 'Your Supplier has been added.', 'success');
          });
        }
      },
    });
  }

  // <========================== CODE FOR GETTING SUPPLIER ====================================>

  getsupplier() {
    this.supplierService.fetchsupplier().subscribe((response) => {
      this.suppliers = <any>response;
      this.addCount(this.suppliers);
    });
  }

  addCount(data: any) {
    let pageSize = 10;
    let pages = Math.ceil(data['count'] / pageSize);
    let nums: any[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    data['pages'] = nums;
    data['current'] = 1;
  }
 

  // <========================== CODE FOR DELETING SUPPLIER ====================================>

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
          this.getsupplier();
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

  // <========================== CODE FOR UPDATING SUPPLIER ====================================>

  openUpdateModal(supplier: Supplier) {
    Swal.fire({
      title: 'Update Supplier Detail',
      html: `
      <div class="update_form" >
      <div class="form-group row  overflow-y-hidden">
      <div class="col">
      <label for="supplierTitle" class="float-start my-2">Title:</label>
      <input type="text" id="supplierTitle" class="form-control" placeholder="Supplier Name"  value="${
        supplier.title
      }">
      </div>
      <div class="col">
      <label for="supplierContact" class="float-start my-2">Contact:</label>
      <input type="number" id="supplierContact" class="form-control" placeholder="Supplier Contact"  value="${
        supplier.contact
      }">
    
      </div>
      </div><br>
      <div classs="form-group overflow-hidden">
        
        <label for="supplierBalance" class="float-start my-2">Balance:</label>
          <input type="number" id="supplierBalance" class="form-control" disabled=true  placeholder="Supplier Balance"  value="${
            supplier.balance
          }" readonly>
          </div><br>
        <div class="form-group row overflow-hidden">
        <div class="col"
        <label for="supplierBalance" class="py-2">Credit:</label>
        <input type="number"  class="form-control" placeholder="Supplier Balance" disabled=true   value="${
          supplier.credit
        }" readonly>
        </div>
        <div class="col"
        <label for="supplierBalance" class="float-start">Debit:</label>
        <input type="number"  class="form-control" placeholder="Supplier Balance" disabled=true  value="${
          supplier.debit
        }" readonly>
        </div>
        </div><br>
        
        <div class="form-group row overflow-hidden">
        <div class="col"
        
        <label for="supplierStatus" class="float-start my-2">Status:</label> 
        <select id="supplierStatus" class="form-select">
        <option value="true" ${
          supplier.status ? 'selected' : ''
        }>Enabled</option>
        <option value="false" ${
          !supplier.status ? 'selected' : ''
        }>Disabled</option>
        </select>
        </div>
        
        <div class="col"
          <label for="supplierEmail" class="float-start my-2">Email:</label>
          <input type="email" id="supplierEmail" class="form-control" placeholder="Supplier Email"  value="${
            supplier.email
          }">
          </div>
          </div><br>
          <div class="form-group overflow-hidden">
            <label for="supplierAddress" class="float-start my-2">Address:</label>
            <input class="form-control" id="supplierAddress" placeholder="Supplier Address"  rows="3" value="${
              supplier.address
            }"></input>
          </div><br>
          </div>
          `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTitle = (<HTMLInputElement>(
          document.querySelector('#supplierTitle')
        )).value;
        const updatedAddress = (<HTMLInputElement>(
          document.querySelector('#supplierAddress')
        )).value;

        const updatedBalance = parseInt(
          (<HTMLInputElement>document.querySelector('#supplierBalance')).value
        );

        const updatedContact = (<HTMLInputElement>(
          document.querySelector('#supplierContact')
        )).value;
        const updatedEmail = (<HTMLInputElement>(
          document.querySelector('#supplierEmail')
        )).value;
        const updatedStatus =
          (<HTMLSelectElement>document.querySelector('#supplierStatus'))
            .value === 'true';

        this.http
          .put(`${this.url}${supplier.id}/`, {
            title: updatedTitle,
            address: updatedAddress,
            contact: updatedContact,
            email: updatedEmail,
            balance: updatedBalance,
            status: updatedStatus,
          })
          .subscribe(
            () => {
              console.log(
                `Supplier with ID ${supplier.id} updated successfully!`
              );
              this.getsupplier();
              Swal.fire(
                'Updated!',
                'Your Supplier list has been updated.',
                'success'
              );
            },
            (error) => {
              console.error(error);
              let errorMessage = 'Failed to update supplier details.';

              if (error && error.error && error.error.address) {
                errorMessage = error.error.address.join('. ');
              }

              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage,
              });
            }
          );
      }
    });
  }
  // <========================== CODE FOR PRINT RECIEPT====================================>
  generatePDF() {
    const columns2 = { title: 'All Suppliers list' };

    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'Title', dataKey: 'title' },
      { title: 'Address', dataKey: 'address' },
      { title: 'Balance', dataKey: 'balance' },
      { title: 'status', dataKey: 'status' },
      { title: 'Contact', dataKey: 'contact' },
      { title: 'Email', dataKey: 'email' },
    ];

    const data = this.suppliers.map((supplier:any, index:any) => ({
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
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);

    (doc as any).autoTable({
      columns: columns,
      body: data,
    });
    doc.save('all_suppliers.pdf');
  }
  p: any;
  title: any;

  // <========================== CODE FOR SEARCHING SUPPLIER ====================================>

  Search() {
    if (this.title == '') {
      this.ngOnInit();
    } else {
      this.suppliers = this.suppliers.filter((res:any) => {
        return res.title.match(this.title);
      });
    }
  }


}
