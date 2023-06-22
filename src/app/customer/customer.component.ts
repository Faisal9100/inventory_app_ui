import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { CustomerService } from '../customer.service';
import { LocalhostApiService } from '../localhost-api.service';

export interface Supplier {
  id: number;
  title: string;
  address: string;
  balance: number;
  status: string;
  contact: number;
  email: string;
  debit: number;
  credit: number;
}

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent {
  supplierToEdit: any;
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  id = 'pagination';
  closeResult: any;

  totalItems: any;
  itemsPerPage: any;
  public url = this.api.localhost + '/inventory/customers/';
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
    public customerservice: CustomerService,
    public api: LocalhostApiService
  ) {
    this.getCustomers();
  }
  ngOnInit(): void {
    this.getCustomers();
  }

  newsupplier = {
    title: '',
    address: '',
    status: '',
    contact: '',
    email: '',
  };

  // <--------------------------------------- code for adding customers ------------------------------------>
  addSupplier() {
    Swal.fire({
      title: 'Add Customer',
      html: `   
        <div class="form-group">
          <label for="supplierTitle" class="float-start my-2">Title:</label>
          <input type="text" id="supplierTitle" class="form-control" placeholder="Customer Name">
        </div>
  
        <div class="form-group">
          <label for="supplierAddress" class="float-start my-2">Address:</label>
          <input type="text" id="supplierAddress" class="form-control" placeholder="Supplier Address">
        </div>
  
        <div class="form-group">
          <label for="supplierStatus" class="float-start my-2">Status:</label> 
          <select id="supplierStatus" class="form-select">
            <option value="true">Enabled</option>
            <option value="false">Disabled</option>
          </select>
        </div>
      
        <div class="form-group">
          <label for="supplierContact" class="float-start my-2">Contact:</label>
          <input type="number" id="supplierContact" class="form-control" placeholder="Customer Contact">
        </div>
      
        <div class="form-group">
          <label for="supplierEmail" class="float-start my-2">Email:</label>
          <input type="email" id="supplierEmail" class="form-control" placeholder="Customer Email">
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
          Swal.showValidationMessage('Customer title is required');
        } else if (!supplierContact) {
          Swal.showValidationMessage('Customer Contact is required');
        } else if (!supplierEmail) {
          Swal.showValidationMessage('Customer Email is required');
        } else if (!validateEmail(supplierEmail)) {
          Swal.showValidationMessage('Enter a valid email address');
        } else {
          const newsupplier = {
            title: supplierTitle,
            address: supplierAddress,
            status: supplierStatus,
            email: supplierEmail,
            contact: supplierContact,
          };
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }),
          };
          this.http
            .post<Supplier>(this.url, newsupplier, httpOptions)
            .subscribe(
              () => {
                this.newsupplier = {
                  title: '',
                  address: '',
                  status: '',
                  contact: '',
                  email: '',
                };
                this.getCustomers();
                Swal.fire('Added!', 'Your Customer has been added.', 'success');
              },
              (error) => {
                if (error.error.email) {
                  Swal.showValidationMessage(error.error.email[0]);
                } else {
                  Swal.fire(
                    'Error',
                    'An error occurred while adding the customer.',
                    'error'
                  );
                }
                console.error(error);
              }
            );
        }
      },
    });

    function validateEmail(email: string) {
      // Regular expression to validate email address
      const emailRegex =
        /^[\w-]+(\.[\w-]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,})$/;
      return emailRegex.test(email);
    }
  }

  // <--------------------------------------- code for getting customers ------------------------------------>

  getCustomers() {
    this.customerservice.getAllPurchase().subscribe((response) => {
      this.suppliers = <any>response;
      this.addCount(this.suppliers);
    });
  }

  search() {
    this.searchSale(this.searchTerm);
  }
  public searchurl = this.api.localhost + '/inventory/customers/';
searchTerm:any;
  searchSale(searchTerm: any) {
    const searchUrl = this.searchurl + '?search=' + searchTerm;
    this.http.get(searchUrl).subscribe((res: any) => {
      this.suppliers = res;
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
 

  onPageChange(event: any) {
    this.currentPage = event;
    this.getCustomers();
  }

  // <--------------------------------------- code for deleting customers ------------------------------------>

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
          this.getCustomers();
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
  // <--------------------------------------- code for updating customers ------------------------------------>

  openUpdateModal(supplier: Supplier) {
    Swal.fire({
      title: 'Update Customer Detail',
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
        <input type="number" id="supplierCredit"  class="form-control" placeholder="Supplier Balance" disabled=true   value="${
          supplier.credit
        }" readonly>
        </div>
        <div class="col"
        <label for="supplierBalance" class="float-start">Debit:</label>
        <input type="number" id="supplierDedit"  class="form-control" placeholder="Supplier Balance" disabled=true  value="${
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
        const updatedCredit = parseInt(
          (<HTMLInputElement>document.querySelector('#supplierCredit')).value
        );
        const updatedDebit = parseInt(
          (<HTMLInputElement>document.querySelector('#supplierDedit')).value
        );
        const updatedContact = (<HTMLInputElement>(
          document.querySelector('#supplierContact')
        )).value;
        const updatedEmail = (<HTMLInputElement>(
          document.querySelector('#supplierEmail')
        )).value;

        const updatedStatus =
          (<HTMLSelectElement>document.querySelector('.swal2-select')).value ===
          'true';
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
          }),
        };
        this.http
          .put(`${this.url}${supplier.id}/`, {
            title: updatedTitle,
            address: updatedAddress,
            contact: updatedContact,
            email: updatedEmail,

            status: updatedStatus,
          })
          .subscribe(() => {
            console.log(
              `Customer with ID ${supplier.id} updated successfully!`
            );
            this.getCustomers();
            Swal.fire(
              'Updated!',
              'Your Customer list has been updated.',
              'success'
            );
          });
      }
    });
  }

  // <-------------------------------------- code for print Reciept   ---------------------------------------->

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
    // doc.setTextColor('red');
    doc.setFontSize(16);

    (doc as any).autoTable({
      columns: columns,
      body: data,
    });
    doc.save('all_customers.pdf');
  }
  p: any;
  title: any;
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
