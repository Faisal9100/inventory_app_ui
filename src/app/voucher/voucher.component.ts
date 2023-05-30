import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../voucher.service';
import { AccountlayerService } from '../accountlayer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css'],
})
export class VoucherComponent implements OnInit {
  accountData: any[] = [];
  transactions: any[] = [];
  debit: number = 0;
  credit: number = 0;
  ngOnInit(): void {
    this.getAccount();
    this.getVoucher();
  }
  constructor(
    public voucher: VoucherService,
    public account: AccountlayerService,
    public http: HttpClient
  ) {}
  getAccount() {
    this.account.getAccounts().subscribe((data) => {
      this.accountData = data.results;
    });
  }
  getVoucher() {
    this.http
      .get('http://192.168.1.9:8000/inventory/vouchar/')
      .subscribe((data: any) => {
        console.log(data);
      });
  }
  form = new FormGroup({
    date: new FormControl('', Validators.required),
    vouchar_type: new FormControl('', Validators.required),
    account: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
  });
  get date() {
    return this.form.get('date');
  }
  get vouchar_type() {
    return this.form.get('vouchar_type');
  }
  get accounts() {
    return this.form.get('account');
  }
  get description() {
    return this.form.get('description');
  }
  get amount() {
    return this.form.get('amount');
  }
  voucherTypes = [
    { value: 'Cash Payment', label: 'Cash Payment' },
    { value: 'Bank Payment', label: 'Bank Payment' },
    { value: 'Cash Receipt', label: 'Cash Receipt' },
    { value: 'Bank Receipt', label: 'Bank Receipt' },
  ];
  getVoucherTypeText(value: any): string {
    const voucherType = this.voucherTypes.find((type) => type.value === value);
    return voucherType ? voucherType.label : '';
  }

  // addTransaction() {
  //   if (this.form.valid) {
  //     const data: any = {};
  //     data['date'] = this.form.value.date;
  //     data['vouchar_type'] = this.form.value.vouchar_type;
  //     data['account'] = this.form.value.account;
  //     data['description'] = this.form.value.description;
  //     data['amount'] = this.form.value.amount;

  //     if (this.form.value.vouchar_type === 'Bank Payment' || this.form.value.vouchar_type === 'Cash Payment') {
  //       data['debit'] = this.credit > 0 ? this.form.value.amount : 0;
  //       data['credit'] = this.debit > 0 ? 0 : this.form.value.amount;
  //     } else {
  //       data['debit'] = this.debit > 0 ? 0 : this.form.value.amount;
  //       data['credit'] = this.credit > 0 ? this.form.value.amount : 0;
  //     }

  //     this.transactions.push(data);
  //     this.form.reset();

  //     // Update debit and credit
  //     this.debit += data['debit'];
  //     this.credit += data['credit'];
  //     this.form.get('vouchar_type')?.disable();
  //     this.form.get('date')?.disable();
  //   }

  //   this.getVoucherTypeText(this.form.value.vouchar_type);
  // }
  addTransaction() {
    if (this.form.valid) {
      const data: any = {};
      data['date'] = this.form.value.date;
      data['vouchar_type'] = this.form.value.vouchar_type;
      data['account'] = this.form.value.account;
      data['description'] = this.form.value.description;
      data['amount'] = this.form.value.amount;

      if (
        this.form.value.vouchar_type === 'Bank Payment' ||
        this.form.value.vouchar_type === 'Cash Payment'
      ) {
        if (
          this.transactions.length === 0 ||
          this.transactions.length % 2 === 0
        ) {
          data['debit'] = this.form.value.amount;
          data['credit'] = 0;
        } else {
          data['debit'] = 0;
          data['credit'] = this.form.value.amount;
        }
      } else {
        if (
          this.transactions.length === 0 ||
          this.transactions.length % 2 === 0
        ) {
          data['debit'] = 0;
          data['credit'] = this.form.value.amount;
        } else {
          data['debit'] = this.form.value.amount;
          data['credit'] = 0;
        }
      }

      this.transactions.push(data);
      this.form.reset();

      // Update debit and credit
      this.debit = this.transactions.reduce(
        (total, transaction) => total + transaction.debit,
        0
      );
      this.credit = this.transactions.reduce(
        (total, transaction) => total + transaction.credit,
        0
      );

      this.form.get('vouchar_type')?.disable();
      this.form.get('date')?.disable();
    }

    this.getVoucherTypeText(this.form.value.vouchar_type);
  }

  isComplete: boolean = false;
  transaction_order_res: any[] = [];
  // saveVouchar() {
  //   if (this.vouchar_type?.value && this.transactions.length >= 1) {
  //     this.basic.loader.next(true);

  //     let data: any = {
  //       vouchar_type: <any>this.vouchar_type?.value,
  //       transactions: JSON.stringify(this.transactions),
  //     };
  //     if (this.date?.value) data['transaction_date'] = <any>this.date?.value;

  //     this.api
  //       .postItem(
  //         'transaction_orders',
  //         'Transaction Order',
  //         <any>data,
  //         true,
  //         true,
  //         false
  //       )
  //       .then((res) => {
  //         this.isComplete = true;
  //         this.transaction_order_res = <any>res;
  //         this.basic.loader.next(false);
  //       })
  //       .catch((error) => this.basic.loader.next(false));
  //   }
  // }
}
