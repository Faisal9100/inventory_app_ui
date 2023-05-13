import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountlayerService } from '../accountlayer.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

export interface Account {
  id: number;
  title: string;
  address: string;
  balance: number;
  status: string;
  contact: number;
  email: string;
}

@Component({
  selector: 'app-accountlayer',
  templateUrl: './accountlayer.component.html',
  styleUrls: ['./accountlayer.component.css'],
})
export class AccountlayerComponent implements OnInit {
  selectedMainLayer?: string;
  ip_address = '192.168.1.9:8000';

  public create_account_url =
    'http://' + this.ip_address + '/inventory/layer2s/';

  public account_url = 'http://' + this.ip_address + '/inventory/accounts/';

  public selectedProductId: number = 5;

  public url =
    'http://' +
    this.ip_address +
    '/inventory/layer2s/' +
    this.selectedProductId +
    '/accounts/';

  id: any;
  selectedLayer1: any;

  accountMain: any;

  mainLayer: string = '';

  layer1: any[] = [];

  layer2: any[] = [];

  selectedLayer2: any;

  accountData: any[] = [];

  pageSize = 10;

  currentPage = 1;

  totalPages?: number;

  pages: number[] = [];

  totalItems: any;

  itemsPerPage: any;

  closeResult: any;

  newAccount = {
    title: '',
    address: '',
    balance: '',
    status: '',
    contact: '',
    email: '',
  };

  account: Account = {
    id: 0,
    title: '',
    address: '',
    status: '',
    balance: 0,
    contact: 0,
    email: '',
  };

  constructor(
    public http: HttpClient,
    public accountLayerservice: AccountlayerService
  ) {}

  ngOnInit(): void {
    this.getLayer1();
    this.accountLayerservice.getAccounts().subscribe(
      (data) => {
        this.accountData = data.results;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // __code for pagination__

  onPageChange(event: any) {
    this.currentPage = event;
    this.getAccountsData();
  }

  // __code for displaying data in Main layer__

  onMainLayerChange(event: any) {
    this.selectedMainLayer = event.target.value;
    if (this.selectedMainLayer !== 'null') {
      this.accountLayerservice
        .getLayer1(this.selectedMainLayer)
        .subscribe((data) => {
          this.layer1 = data;
        });
    } else {
      this.layer1 = [];
      this.layer2 = [];
    }
  }

  onLayer1Change(selectedLayer1: any) {
    this.accountLayerservice
      .getLayer2(this.selectedLayer1)
      .subscribe((data) => {
        this.layer2 = data;
        console.log(this.selectedLayer1);
      });
  }

  // __ code for adding layer1 data__

  getLayer1() {
    this.accountLayerservice.getLayer1(this.selectedMainLayer).subscribe(
      (data) => {
        this.layer1 = data;
        this.selectedMainLayer = this.selectedMainLayer;
        // console.log(data);
      },

      (error) => {
        console.log(error);
      }
    );
  }

  // __ code for adding layer2 data__

  getLayer2(selectedLayer1: any) {
    this.accountLayerservice.getLayer2(selectedLayer1).subscribe((data) => {
      this.layer2 = data;

      console.log(data);
    });
  }
  // fetchsupplier() {
  //   let skip = (this.currentPage - 1) * this.pageSize;

  //   let limit = 20;
  //   let url = `${this.url}?skip=${skip}&limit=${limit}`;

  //   this.http.get<any>(url).subscribe((response) => {
  //     this.suppliers = <any>response.results;
  //     this.totalPages = Math.ceil(response.count / this.pageSize);
  //     this.totalItems = response.count;

  //     this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
  //   });
  // }

  // __code for getting Account Data__

  getAccountsData() {
    let skip = (this.currentPage - 1) * this.pageSize;

    let limit = 20;
    this.accountLayerservice.getAccounts().subscribe((data) => {
      this.accountData = data.results;
      this.totalPages = Math.ceil(data.count / this.pageSize);
      this.totalItems = data.count;
      this.accountData.push(data);
      this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);
    });
  }

  // __code for deleting Accounts__

  deleteAccount(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this account!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http
          .delete(`${this.account_url}${id}/`)

          .subscribe(
            () => {
              Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
              );

              this.getAccountsData();
            },
            () => {
              Swal.fire('Error!', 'You cannot delete this Account.', 'error');
            }
          );
      }
    });
  }

  // __code for adding account__

  addAccount() {
    Swal.fire({
      title: 'Add Account',
      html: `
      <div class="form-group">
        <label for="Title" class="float-start my-2">Title:</label>
        <input type="text" id="accountTitle" class="form-control" placeholder="Account Title" >
        </div>
     
        <div class="form-group">
        <label for="Address" class="float-start my-2">Address:</label>
        <input type="text" id="accountAddress" class="form-control" placeholder=" Address" >
      </div>
      
      <div class="form-group">
        <label for="Balance:" class="float-start my-2">Balance:</label>
        <input type="text" id="accountBalance" class="form-control" placeholder=" Balance" >
      </div>
       
      <div class="form-group">
  <label for="supplierStatus" class="float-start my-2">Status:</label> 
  <select id="accountStatus" class="form-select">
    <option value="true"}>Active</option>
    <option value="false"}>Inactive</option>
  </select>
</div>
          
         
      <div class="form-group">
      <label for="Balance:" class="float-start my-2">Contact:</label>
      <input type="text" id="accountContact" class="form-control"placeholder="Contact">
    </div>
         
          
          <div class="form-group">
          <label for="Balance:" class="float-start my-2">Email:</label>
          <input type="text" id="accountEmail" class="form-control" placeholder=" Email" >
        </div>

          `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const accountTitle = (<HTMLInputElement>(
          document.getElementById('accountTitle')
        )).value;
        const accountAddress = (<HTMLInputElement>(
          document.getElementById('accountAddress')
        )).value;
        const accountBalance = (<HTMLInputElement>(
          document.getElementById('accountBalance')
        )).value;
        const accountStatus = (<HTMLSelectElement>(
          document.getElementById('accountStatus')
        )).value;
        const accountContact = (<HTMLInputElement>(
          document.getElementById('accountContact')
        )).value;
        const accountEmail = (<HTMLInputElement>(
          document.getElementById('accountEmail')
        )).value;

        if (!accountTitle) {
          Swal.showValidationMessage('Account title is required');
        } else {
          const newaccount = {
            title: accountTitle,
          };
          this.http
            .post<Account>(
              `${this.create_account_url}${this.selectedLayer2}/accounts/`,
              newaccount
            )
            .subscribe(() => {
              this.newAccount = {
                title: '',
                address: '',
                balance: '',
                status: '',
                contact: '',
                email: '',
              };
              this.getAccountsData();

              Swal.fire('Added!', 'Your Account has been added.', 'success');
              this.accountLayerservice.accountAdded.emit(this.account);
            });
        }
      },
    });
  }


  updateAccount(account: Account): void {
    Swal.fire({
      title: 'Update Account',
      html: `
      <div class="form-group">
        <label class="float-start my-2">title:</label>
        <input type="text" id="accountTitle" class="form-control" placeholder="Account Title" value="${
          account.title
        }">
       </div>

        <label class="float-start my-2">Address:</label>
        <input type="text" id="accountAddress" class="form-control" placeholder=" Address " value="${
          account.address
        }">
      
        <label class="float-start my-2">Balance:</label>
        <input type="text" id="accountBalance" class="form-control" placeholder=" Balance" value="${
          account.balance
        }">
        
        <label class="float-start my-2">Status:</label>
        
        <select id="accountStatus" class="form-select">
          <option value="true" ${
            account.status ? 'selected' : ''
          }>Active</option>
          <option value="false" ${
            !account.status ? 'selected' : ''
          }>Inactive</option>
        </select>
       
        <br><label class="float-start my-2">Contact:</label>
        <input type="text" id="accountContact" class="form-control" placeholder="Contact" value="${
          account.contact
        }">
       
        <br><label class="float-start my-2">Email:</label>
        <input type="text" id="accountEmail" class="form-control" placeholder="Email" value="${
          account.email
        }">
        `,
      showCancelButton: true,
      confirmButtonText: 'Update',
      preConfirm: () => {
        const accountTitle = (<HTMLInputElement>(
          document.getElementById('accountTitle')
        )).value;
        const accountAddress = (<HTMLInputElement>(
          document.getElementById('accountAddress')
        )).value;
        const accountBalance = (<HTMLInputElement>(
          document.getElementById('accountBalance')
        )).value;
        const accountStatus = (<HTMLSelectElement>(
          document.getElementById('accountStatus')
        )).value;
        const accountContact = (<HTMLInputElement>(
          document.getElementById('accountContact')
        )).value;
        const accountEmail = (<HTMLInputElement>(
          document.getElementById('accountEmail')
        )).value;

        if (!accountTitle) {
          Swal.showValidationMessage('Account title is required');
        } else {
          const updatedAccount = {
            title: accountTitle,
           
          };
          this.http
            .put<Account>(`${this.account_url}${account.id}/`, updatedAccount)
            .subscribe(() => {
              this.getAccountsData();

              Swal.fire(
                'Updated!',
                'Your Account has been updated.',
                'success'
              );
            });
        }
      },
    });
  }

  // __code for print account Details__

  generatePDF() {
    const columns2 = { title: 'All Accounts list' };

    const columns = [
      { title: 'S.N', dataKey: 'sn' },
      { title: 'Account Title', dataKey: 'title' },
      { title: 'Contact', dataKey: 'contact' },
      { title: 'status', dataKey: 'status' },
      { title: 'Balance', dataKey: 'balance' },
      { title: 'Email', dataKey: 'email' },
      { title: 'Address', dataKey: 'address' },
    ];

    const data = this.accountData.map((account, index) => ({
      sn: index + 1,
      title: account.title,
      contact: account.contact,
      status: account.status,
      balance: account.balance,
      email: account.email,
      address: account.address,
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
    doc.save('all_this.accounts.pdf');
  }
}
