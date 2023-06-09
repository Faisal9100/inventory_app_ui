import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountlayerService } from '../accountlayer.service';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import { LocalhostApiService } from '../localhost-api.service';
import { catchError, of } from 'rxjs';
import html2canvas from 'html2canvas';

export interface Account {
  id: number;
  title: string;
  address: string;
  balance: number;
  status: string;
  contact: number;
  credit: number;
  debit: number;
  email: string;
  account_type: string;
}

@Component({
  selector: 'app-accountlayer',
  templateUrl: './accountlayer.component.html',
  styleUrls: ['./accountlayer.component.css'],
})
export class AccountlayerComponent implements OnInit {
  selectedMainLayer?: any;
  selectedMainLayer2?: string;

  public create_account_url = this.api.localhost + '/inventory/layer2s/';

  public addLayer1 =
    this.api.localhost + '/inventory/layer1s/11/?main_layer=assets';

  public account_url = this.api.localhost + '/inventory/accounts/';

  public selectedProductId: number = 5;

  public url =
    this.api.localhost +
    '/inventory/layer2s/' +
    this.selectedProductId +
    '/accounts/';

  id: any;
  selectedLayer1: any;
  item: any;
  accountMain: any;

  mainLayer: string = '';

  layer1: any[] = [];

  layer2: any[] = [];

  selectedLayer2: any;

  accountData: any = {};

  pageSize = 10;

  currentPage = 1;

  totalPages?: number;

  pages: number[] = [];

  totalItems: any;

  itemsPerPage: any;

  closeResult: any;

  p: any;

  newAccount = {
    title: '',
    address: '',
    credit: '',
    debit: '',
    status: '',
    contact: '',
    email: '',
  };

  account_type: any;
  account: Account = {
    id: 0,
    title: '',
    address: '',
    status: '',
    credit: 0,
    debit: 0,
    balance: 0,
    contact: 0,
    email: '',
    account_type: '',
  };

  constructor(
    public http: HttpClient,
    public accountLayerservice: AccountlayerService,
    public api: LocalhostApiService
  ) {}

  ngOnInit(): void {
    this.getLayer1();
    // this.getLayerChange();
    this.getAccountsData();
  }

  mainLayerId: any;

  someValue: any;

  selectedMainLayerAccounts: any = [];
  selectedMainLayerAccount: any;

  onLayer1Change(selectedLayer1: any) {
    this.selectedLayer1 = selectedLayer1;
    this.accountLayerservice.getLayer2(this.selectedLayer1).subscribe(
      (data) => {
        this.layer2 = data;
        console.log(this.selectedLayer1);
        // Retrieve accounts based on selected main layer, layer 1, and layer 2
        this.getAccountsData();
      },
      // this.layer1 = '';
      (error) => {
        console.log(error);
      }
    );
  }

  onLayer2Change(selectedLayer2: any) {
    this.selectedLayer2 = selectedLayer2;
    this.accountLayerservice.getLayer2(this.selectedLayer2).subscribe(
      (data) => {
        console.log(this.selectedLayer1);
        // Retrieve accounts based on selected main layer, layer 1, and layer 2
        this.getAccountsData();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // <______________________________________ code for adding layer1 data _____________________________________>

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

  // <________________________________ code for adding layer2 data_____________________________________________>

  getLayer2(selectedLayer1: any) {
    this.accountLayerservice.getLayer2(selectedLayer1).subscribe(
      (data) => {
        this.layer2 = data;
        this.getAccountsData();
        console.log(data);
      },
      (error) => {
        // Handle the error response
        this.errorMessage = error;
      }
    );
  }

  // <________________________________ code for displaying data in Main layer ____________________________________>

  onMainLayerChange(event: any) {
    this.selectedMainLayer = event.target.value;
    if (this.selectedMainLayer !== 'null') {
      this.accountLayerservice.getLayer1(this.selectedMainLayer).subscribe(
        (data) => {
          this.layer1 = data;
          // Update the selected layer 1 value
          this.selectedLayer1 = '';
          this.selectedLayer2 = ''; // Or set it to the default value you desire
          this.accountData = []; // Clear the account data when changing the main layer

          // Retrieve accounts based on selected main layer and layer 1
          this.getAccountsData();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.layer1 = [];
      this.layer2 = [];

      this.selectedLayer2 = '';
      this.selectedLayer1 = ''; // Reset the selected layer 1 value
      this.accountData = []; // Clear the account data when changing the main layer
    }
  }

  // <________________________________ code for getting all accounts____________________________________>

  getAccountsData() {
    this.accountLayerservice
      .getAccounts(
        this.selectedMainLayer,
        this.selectedLayer1,
        this.selectedLayer2
      )
      .subscribe(
        (data) => {
          this.accountData = data;
          this.addCount(this.accountData);
        },
        (error) => {
          // Handle the error response
          this.errorMessage = error;
        }
      );
  }

  // <________________________________ code for searching all accounts____________________________________>

  search() {
    this.searchAccount(this.searchTerm);
  }
  public searchurl = this.api.localhost + '/inventory/accounts';
  searchTerm: any;
  searchAccount(searchTerm: any) {
    const searchUrl = this.searchurl + '?search=' + searchTerm;
    this.http.get(searchUrl).subscribe((res: any) => {
      this.accountData = res;
      this.addCount(this.accountData);
    });
  }

  // <________________________________ code for pagination ____________________________________>

  errorMessage: any;
  addCount(data: any) {
    let pageSize = 10;
    let pages = Math.ceil(data['count'] / pageSize);
    let nums: any[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    data['pages'] = nums;
    data['current'] = 1;
  }
  // <________________________________code for deleting Accounts_____________________________________________>

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

  // <------------------------------------ code for adding account ---------------------------------------->

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

        const accountStatus = (<HTMLSelectElement>(
          document.getElementById('accountStatus')
        )).value;
        const accountContact = (<HTMLInputElement>(
          document.getElementById('accountContact')
        )).value;
        const accountEmail = (<HTMLInputElement>(
          document.getElementById('accountEmail')
        )).value;

        if (
          !accountTitle ||
          !accountAddress ||
          !accountStatus ||
          !accountContact ||
          !accountEmail
        ) {
          Swal.showValidationMessage('All Fields are Required');
        } else {
          const newaccount = {
            title: accountTitle,
            address: accountAddress,
            status: accountStatus,
            contact: accountContact,
            email: accountEmail,
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
                credit: '',
                debit: '',
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

  // <------------------------------------ code for updating account ---------------------------------------->

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
      
        <div classs="form-group overflow-hidden">
        
        <label for="supplierBalance" class="float-start my-2">Balance:</label>
          <input type="number" id="supplierBalance" class="form-control" disabled=true  placeholder="Supplier Balance"  value="${
            account.balance
          }" readonly>
          </div><br>
        <div class="form-group row overflow-hidden">
        <div class="col"
        <label for="supplierBalance" class="py-2">Credit:</label>
        <input type="number" id="supplierCredit"  class="form-control" placeholder="Supplier Balance" disabled=true   value="${
          account.credit
        }" readonly>
        </div>
        <div class="col"
        <label for="supplierBalance" class="float-start">Debit:</label>
        <input type="number" id="supplierDedit"  class="form-control" placeholder="Supplier Balance" disabled=true  value="${
          account.debit
        }" readonly>
        </div>
        </div><br>
        
        
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
          document.getElementById('supplierBalance')
        )).value;
        const accountCredit = (<HTMLInputElement>(
          document.getElementById('supplierCredit')
        )).value;
        const accountDebit = (<HTMLInputElement>(
          document.getElementById('supplierDedit')
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
            address: accountAddress,
            status: accountStatus,
            contact: accountContact,
            email: accountEmail,
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

  // <------------------------------------ code for print account Details ---------------------------------------->
  // generatePDF() {
  //   const columns2 = { title: 'All Accounts list' };

  //   const columns = [
  //     { title: 'S.N', dataKey: 'sn' },
  //     { title: 'Account Title', dataKey: 'title' },
  //     { title: 'Contact', dataKey: 'contact' },
  //     { title: 'status', dataKey: 'status' },
  //     { title: 'Balance', dataKey: 'balance' },
  //     { title: 'Email', dataKey: 'email' },
  //     { title: 'Address', dataKey: 'address' },
  //   ];

  //   const data = this.accountData.map((account: any, index: any) => ({
  //     sn: index + 1,
  //     title: account.title,
  //     contact: account.contact,
  //     status: account.status,
  //     balance: account.balance,
  //     email: account.email,
  //     address: account.address,
  //   }));

  //   const doc = new jsPDF();
  //   doc.text(columns2.title, 86, 8);

  //   doc.setFontSize(22);
  //   doc.setTextColor(0, 0, 0);
  //   doc.setFontSize(16);

  //   (doc as any).autoTable({
  //     columns: columns,
  //     body: data,
  //   });
  //   doc.save('all_this.accounts.pdf');
  // }

  generatePDF() {
    const pdfElement = document.getElementById('pdf-content');

    if (pdfElement) {
      const options = {
        scale: 5, // Increase scale factor for higher resolution
        dpi: 300, // Increase DPI for better quality
        useCORS: true, // Enable CORS to prevent tainted canvas error
      };

      html2canvas(pdfElement, options).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('All Accounts.pdf');
      });
    }
  }

  newLayerAccount = {
    name: '',
  };

  //  <------------------------ CODE FOR ADDING LAYER ONE ACCOUNT  ------------------------>

  addLayer_one_new_account(selectedMainLayer: any) {
    Swal.fire({
      title: 'Add Layer One',
      html: `
        <div class="form-group">
          <label for="Title" class="float-start my-2">Name:</label>
          <input type="text" id="accountName" class="form-control" placeholder="Name" >
          </div>
  
            `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const accountName = (<HTMLInputElement>(
          document.getElementById('accountName')
        )).value;
        if (!accountName || !selectedMainLayer) {
          Swal.showValidationMessage(
            'Layer One Name is required and Main Layer must be selected.'
          );
        } else {
          const newLayeraccount = {
            name: accountName,
          };
          this.http

            .post<Account>(
              this.api.localhost +
                `/inventory/layer1s/?main_layer=${selectedMainLayer}`,
              newLayeraccount
            )
            .subscribe(() => {
              this.newLayerAccount = {
                name: '',
              };
              this.getAccountsData();
              this.getLayer1();

              Swal.fire('Added!', 'Your Account has been added.', 'success');
              this.accountLayerservice.accountAdded.emit(this.account);
            });
        }
      },
    });
  }

  //  <------------------------ CODE FOR DELETING LAYER ONE ACCOUNT ------------------------>

  DeleteLayer_one_new_account(selectedMainLayer: any, selectedLayer1: number) {
    Swal.fire({
      title: 'Delete Account',
      text: 'Are you sure you want to delete this account?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      preConfirm: () => {
        if (!selectedMainLayer || !selectedLayer1) {
          Swal.showValidationMessage(
            'Main Layer and Layer One must be selected.'
          );
        }
        return this.http
          .delete(
            this.api.localhost +
              `/inventory/layer1s/${selectedLayer1}/?main_layer=${selectedMainLayer}`
          )
          .toPromise()
          .then(() => {
            // this.getAccountsData();

            this.getLayer1();
            Swal.fire('Deleted!', 'Your Account has been deleted.', 'success');
            this.accountLayerservice.accountAdded.emit(this.account);
          })
          .catch((error) => {
            let errorMessage = 'An error occurred while deleting the account.';
            if (error.error && error.error.delete) {
              errorMessage = error.error.delete;
            }
            Swal.fire('Error', errorMessage, 'error');
          });
      },
    });
  }

  // Swal.fire({
  //   icon: 'error',
  //   title: 'Deleting Failed',
  //   text: 'You cannot delete this row.',
  // });

  //  <------------------------ CODE FOR ADDING LAYER TWO ACCOUNT  ------------------------>

  addLayer_two_new_account(selectedLayer2: any) {
    this.errorMessage = '';
    Swal.fire({
      title: 'Add Layer Two',
      html: `
        <div class="form-group">
          <label for="Title" class="float-start my-2">Name:</label>
          <input type="text" id="accountName" class="form-control" placeholder="Name" >
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Add',
      preConfirm: () => {
        const accountName = (<HTMLInputElement>(
          document.getElementById('accountName')
        )).value;
        if (!accountName || !selectedLayer2) {
          Swal.showValidationMessage(
            'Layer Two Name is required and Layer One must be selected.'
          );
        } else {
          const newLayeraccount = {
            name: accountName,
          };
          this.http
            .post<Account>(
              this.api.localhost +
                `/inventory/layer1s/${selectedLayer2}/layer2s/`,
              newLayeraccount
            )
            .subscribe(
              () => {
                this.newLayerAccount = {
                  name: '',
                };
                this.getAccountsData();
                this.getLayer2(this.selectedLayer1);

                Swal.fire('Added!', 'Your Account has been added.', 'success');
                this.accountLayerservice.accountAdded.emit(this.account);
              },
              (error) => {
                error =
                  'IntegrityError at /inventory/layer1s/7/layer2s/\n(1048, "Column \'main_layer\' cannot be null")';
                this.errorMessage = error;
                // if (
                //   error.status === 500 &&
                //   error.error ===
                //     'IntegrityError at /inventory/layer1s/7/layer2s/\n(1048, "Column \'main_layer\' cannot be null")'
                // ) {
                //   Swal.fire('Error!', 'Layer One must be selected.', 'error');
                // } else {
                //   Swal.fire('Error!', 'An unexpected error occurred.', 'error');
                // }
              }
            );
        }
      },
    });
  }

  //  <------------------------ CODE FOR DELETING LAYER TWO ACCOUNT ------------------------>

  DeleteLayer_two_new_account(selectedLayer2: number, selectedLayer1: number) {
    Swal.fire({
      title: 'Delete Account',
      text: 'Are you sure you want to delete this account?',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      preConfirm: () => {
        if (!selectedLayer2 || !selectedLayer1) {
          return Promise.reject(
            new Error('Layer Two and Layer One must be selected.')
          );
        }
        const url =
          this.api.localhost +
          `/inventory/layer1s/${selectedLayer2}/layer2s/${selectedLayer1}`;
        return this.http.delete(url).toPromise();
      },
    })
      .then((result) => {
        if (result.isConfirmed) {
          Swal.fire('Deleted!', 'Your Account has been deleted.', 'success');
          this.accountLayerservice.accountAdded.emit(this.account);
          // Clear the input fields here
          this.getLayer2(this.selectedLayer2);
          this.selectedLayer2 = null;
          this.selectedLayer1 = null;
          this.selectedMainLayer = null;
          // this.getAccountsData();
          // Clear any other relevant form controls or variables
        }
      })
      .catch((error) => {
        console.error(error);
        let errorMessage = 'Failed to delete the account.';
        if (error.message) {
          errorMessage = error.message;
        }
        Swal.fire('Error', errorMessage, 'error');
      });
  }

  title: any;
  Search() {
    if (this.title === '') {
      this.ngOnInit();
    } else {
      // const capitalizedTitle =
      // this.title.charAt(0).toUpperCase() + this.title.slice(1);
      this.accountData = this.accountData.filter((res: any) => {
        return res.title.includes(this.title);
      });
    }
  }
  refresh() {
    window.location.reload();
  }
}
