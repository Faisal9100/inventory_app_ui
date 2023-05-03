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
  
  accountMain: any;
  mainLayer: string = '';
  layer1: any[] = [];
  selectedLayer1: number = 0;
  layer2: any[] = [];
  selectedLayer2: number = 0;
  accountData: any[] = [];
  constructor(
    public http: HttpClient,
    public accountLayerservice: AccountlayerService
  ) {}
  ngOnInit(): void {
    this.accountLayerservice.getAccounts().subscribe(
      (data) => {
        this.accountData = data.results;
        // console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
   
    this.accountLayerservice.getLayer1().subscribe(
      (data) => {
        this.layer1 = data;
        
      },
      
      (error) => {
        console.log(error);
      }
    );
  }

  getProducts() {
    this.accountLayerservice.getAccounts().subscribe((data) => {
      this.accountData = data.results;
    });
  }
  

  public selectedProductId: number=5 ; // example ID

  public ip_address = '192.168.1.9:8000';
  public url = 'http://' + this.ip_address + '/inventory/layer2s/' + this.selectedProductId + '/accounts/';
  id:any
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
        this.http.delete(`${'http://' + this.ip_address + '/inventory/layer2s/'+id+'/accounts/'}`).subscribe(
          () => {
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');

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
  addSupplier() {
    Swal.fire({
      title: 'Add Supplier',
      html: `
         <label>title:</label>
          <input type="text" id="supplierTitle" class="swal2-input" placeholder="Account Title">
         
          <label>Address:</label>
          <input type="text" id="supplierAddress" class="swal2-input" placeholder=" Address ">
        
          <label>Balance:</label>
          <input type="text" id="supplierBalance" class="swal2-input" placeholder=" Balance">
          
          <label>Status:</label>
          
          <select id="supplierStatus" class="swal2-select">
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
         
          <br><label>Contact:</label>
          <input type="text" id="supplierContact" class="swal2-input" placeholder="Contact">
         
          <br><label>Email:</label>
          <input type="text" id="supplierEmail" class="swal2-input" placeholder="Email">
         
        
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
          Swal.showValidationMessage('Supplier title is required');
        } else {
          const newsupplier = {
            title: supplierTitle,
            address: supplierAddress,
            status: supplierStatus,
            balance: supplierBalance,
            email: supplierEmail,
            contact: supplierContact,
          };
          this.http.post<Account>(this.url, newsupplier).subscribe(() => {
            this.newAccount = {
              title: '',
              address: '',
              balance: '',
              status: '',
              contact: '',
              email: '',
            };
            this.accountLayerservice.getAccounts();

            Swal.fire('Added!', 'Your Supplier has been added.', 'success');
          });
        }
      },
    });
  }
}
