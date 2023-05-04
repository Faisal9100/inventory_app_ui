import { ProductService } from './../product.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AccountlayerService } from '../accountlayer.service';
import Swal from 'sweetalert2';

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
    'http://192.168.1.9:8000/inventory/layer2s/2/accounts/';

  selectedLayer1: any;
  accountMain: any;
  mainLayer: string = '';
  layer1: any[] = [];
  layer2: any[] = [];
  selectedLayer2: any;
  accountData: any[] = [];
  constructor(
    public http: HttpClient,
    public accountLayerservice: AccountlayerService
  ) {}

  ngOnInit(): void {
    this.getLayer1();
    this.accountLayerservice.getAccounts().subscribe(
      (data) => {
        this.accountData = data.results;
        // console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

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
  getLayer2(selectedLayer1: any) {
    this.accountLayerservice.getLayer2(selectedLayer1).subscribe((data) => {
      this.layer2 = data;

      console.log(data);
    });
  }
  // getLayer2(id: any) {
  //   const url = `http://${this.ip_address}/inventory/layer1s/${id}/layer2s/`;
  //   console.log('Selected Layer1 ID:', id);
  //   this.accountLayerservice.getLayer2(url).subscribe((data) => {
  //     this.layer2 = data;
  //     console.log(data);
  //   });
  // }

  getProducts() {
    this.accountLayerservice.getAccounts().subscribe((data) => {
      this.accountData = data.results;
    });
  }

  public selectedProductId: number = 5; // example ID

  public url =
    'http://' +
    this.ip_address +
    '/inventory/layer2s/' +
    this.selectedProductId +
    '/accounts/';
  id: any;
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
          .delete(
            `${'http://' + this.ip_address + '/inventory/accounts/${id}'}`
          )
          // give proper id
          .subscribe(
            () => {
              Swal.fire(
                'Deleted!',
                'Your product has been deleted.',
                'success'
              );

              this.accountLayerservice.getAccounts();
            },
            () => {
              Swal.fire('Error!', 'You cannot delete this Account.', 'error');
            }
          );
      }
    });
  }
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
  addAccount() {
    Swal.fire({
      title: 'Add Account',
      html: `
         <label>title:</label>
          <input type="text" id="accountTitle" class="swal2-input" placeholder="Account Title">
         
          <label>Address:</label>
          <input type="text" id="accountAddress" class="swal2-input" placeholder=" Address ">
        
          <label>Balance:</label>
          <input type="text" id="accountBalance" class="swal2-input" placeholder=" Balance">
          
          <label>Status:</label>
          
          <select id="accountStatus" class="swal2-select">
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
         
          <br><label>Contact:</label>
          <input type="text" id="accountContact" class="swal2-input" placeholder="Contact">
         
          <br><label>Email:</label>
          <input type="text" id="accountEmail" class="swal2-input" placeholder="Email">
    
   
        
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
            address: accountAddress,
            status: accountStatus,
            balance: accountBalance,
            email: accountEmail,
            contact: accountContact,
          };
          this.http
            .post<Account>(this.create_account_url, newaccount)
            .subscribe(() => {
              this.newAccount = {
                title: '',
                address: '',
                balance: '',
                status: '',
                contact: '',
                email: '',
              };
              this.accountLayerservice.getAccounts();

              Swal.fire('Added!', 'Your Account has been added.', 'success');
            });
        }
      },
    });
  }
  onAddModifyLayer2() {
    const selectedValue = this.selectedLayer2;
    Swal.fire({
      title: 'Selected Layer 2',
      text: selectedValue,
      icon: 'success',
    });
  }
}
