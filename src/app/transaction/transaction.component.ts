import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../api.service';
import { BasicService } from '../basic.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent  implements OnInit{
  constructor(public basic:BasicService,public api:ApiService,public data:DataService){}
  name: string = 'transactions';
  title: string = 'Transaction';

  titles: any = [
    'id',
    'transaction_date',
    'transaction_order',
    'vouchar_type_name',
    'narration',
    'debit',
    'credit',
    // '',
  ];
  headers: any = [
    '#',
    'Trans Date',
    'Trans Id',
    'Type',
    'Detail',
    'Dr',
    'Cr',
    'Balance',
  ];

  ngOnInit(): void {
    // Promise.resolve().then((res) => this.basic.loader.next(true));
    // this.basic.setNav('accounts');
    // this.api['transactions'] = null;
    // this.api
    //   .getAllItems('accounts', 'allAccounts', null, true)
    //   .then((res) => {
    //     this.basic.loader.next(false);
    //   })
    //   .catch((error) => this.basic.loader.next(false));
    // this.from?.setValue(formatDate(this.basic.date, 'yyyy-MM-dd', 'en'));
    // this.to?.setValue(formatDate(this.basic.date, 'yyyy-MM-dd', 'en'));
  }
  form = new FormGroup({
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    account: new FormControl('', Validators.required),
  });
  get from() {
    return this.form.get('from');
  }
  get to() {
    return this.form.get('to');
  }
  get account() {
    return this.form.get('account');
  }

  _account: any;
  accountChange() {
    // if (this.account?.valid) {
    //   Promise.resolve().then((res) => this.basic.loader.next(true));
    //   let params: any = '&account=' + this.account.value;
    //   if (this.from?.valid)
    //     params += '&transaction_date__gte=' + this.from.value;
    //   if (this.to?.valid) params += '&transaction_date__lte=' + this.to.value;
    //   this.api
    //     .getItems('transactions', 'transactions', null, params, true)
    //     .then((res) => {
    //       this.api
    //         .getItem('accounts', this.account?.value, 'Account')
    //         .then((accRes) => {
    //           this._account = accRes;
    //           this.basic.loader.next(false);
    //         })
    //         .catch((error) => this.basic.loader.next(false));
    //     })
    //     .catch((error) => this.basic.loader.next(false));
    // }
  }

  // ------------ Getting Transaction ------------------
  detail_loader: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  transaction: any;
  getTransaction(id: any) {
  //   Promise.resolve().then((res) => this.detail_loader.next(true));
  //   this.api
  //     .getItem('transaction_orders', id, 'Transaction Order')
  //     .then((res) => {
  //       this.transaction = res;
  //       setTimeout(() => this.detail_loader.next(false), 200);
  //     })
  //     .catch((error) => {
  //       document
  //         .getElementById('transaction_order_modal_close_button')
  //         ?.click();
  //       this.detail_loader.next(false);
  //     });
  // }
}}
