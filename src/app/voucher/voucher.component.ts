import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../voucher.service';
import { AccountlayerService } from '../accountlayer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

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
  basic: any;
  ngOnInit(): void {
    this.getAccount();
    // this.getVoucher();
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

  // getVoucher() {
  //   this.http
  //     .get('http://127.0.0.1:8000/inventory/vouchar/')
  //     .subscribe((data: any) => {
  //       this.transactionsData = data.results;
  //       console.log(data);
  //     });
  // }
  form = new FormGroup({
    date: new FormControl('', Validators.required),
    voucher_type: new FormControl('', Validators.required),
    account: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    amount: new FormControl('', Validators.required),
  });
  get date() {
    return this.form.get('date');
  }
  get voucher_type() {
    return this.form.get('voucher_type');
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
  transactionCount: number = 0;

  getVoucherTypeText(value: any): string {
    const voucherType = this.voucherTypes.find((type) => type.value === value);
    return voucherType ? voucherType.label : '';
  }

  // addTransaction() {
  //   if (this.form.valid) {
  //     const data: any = {};
  //     data['date'] = this.form.value.date;
  //     data['voucher_type'] = this.form.value.voucher_type;
  //     data['account'] = this.form.value.account;
  //     data['description'] = this.form.value.description;
  //     data['amount'] = this.form.value.amount;

  //     // Check transaction count and voucher type to determine debit or credit
  //     if (
  //       (this.form.value.voucher_type === 'Cash Payment' ||
  //         this.form.value.voucher_type === 'Bank Payment') &&
  //       this.transactionCount === 0
  //     ) {
  //       data['debit'] = this.form.value.amount;
  //       data['credit'] = 0;
  //     } else if (this.transactionCount === 1) {
  //       data['debit'] = 0;
  //       data['credit'] = this.form.value.amount;
  //       this.debit = 0;
  //       // Assign date and voucher type from the first transaction
  //       data['date'] = this.transactions[0]['date'];
  //       data['voucher_type'] = this.transactions[0]['voucher_type'];
  //     } else if (
  //       (this.form.value.voucher_type === 'Cash Receipt' ||
  //         this.form.value.voucher_type === 'Bank Receipt') &&
  //       this.transactionCount === 0
  //     ) {
  //       data['credit'] = this.form.value.amount;
  //       data['debit'] = 0;
  //     } else {
  //       data['credit'] = 0;
  //       data['debit'] = this.form.value.amount;
  //     }

  //     this.transactions.push(data);
  //     this.transactionCount++;

  //     this.form.get('account')?.setValue('');
  //     this.form.get('description')?.setValue('');
  //     this.form.get('amount')?.setValue('');

  //     // Update debit and credit
  //     this.debit += data['debit'];
  //     this.credit += data['credit'];

  //     this.form.get('voucher_type')?.disable();
  //     this.form.get('date')?.disable();
  //   }
  // }

  addTransaction() {
    if (this.form.valid) {
      // if (
      //   this.form.value.voucher_type === 'Bank Payment' ||
      //   this.form.value.voucher_type === 'Bank Receipt'
      // ) {
      //   this.accountData = this.accountData.filter(
      //     (account: { sub_layer_keyword: string }) =>
      //       account.sub_layer_keyword === 'bank'
      //   );
      // } else if (
      //   this.form.value.voucher_type === 'Cash Receipt' ||
      //   this.form.value.voucher_type === 'Cash Payment'
      // ) {
      //   this.accountData = this.accountData.filter(
      //     (account: { sub_layer_keyword: string }) =>
      //       account.sub_layer_keyword === 'cashinhand'
      //   );
      // }
      const data: any = {};
      data['date'] = this.form.value.date;
      data['voucher_type'] = this.form.value.voucher_type;
      data['account'] = this.form.value.account;
      data['description'] = this.form.value.description;
      data['amount'] = this.form.value.amount;
      console.log(data);
      // Check transaction count and voucher type to determine debit or credit
      if (
        (this.form.value.voucher_type === 'Cash Payment' ||
          this.form.value.voucher_type === 'Bank Payment') &&
        this.transactionCount === 0
      ) {
        data['debit'] = this.form.value.amount;
        data['credit'] = 0;
      } else if (this.transactionCount === 1) {
        data['debit'] = 0;
        data['credit'] = this.form.value.amount;
        this.debit = 0;
        // Assign date and voucher type from the first transaction
        data['date'] = this.transactions[0]['date'];
        data['voucher_type'] = this.transactions[0]['voucher_type'];
      } else if (
        (this.form.value.voucher_type === 'Cash Receipt' ||
          this.form.value.voucher_type === 'Bank Receipt') &&
        this.transactionCount === 0
      ) {
        data['credit'] = this.form.value.amount;
        data['debit'] = 0;
      } else {
        data['credit'] = 0;
        data['debit'] = this.form.value.amount;
      }

      this.transactions.push(data);
      this.transactionCount++;

      this.form.get('account')?.setValue('');
      this.form.get('description')?.setValue('');
      this.form.get('amount')?.setValue('');

      // Update debit and credit
      this.debit += data['debit'];
      this.credit += data['credit'];

      this.form.get('voucher_type')?.disable();
      this.form.get('date')?.disable();
    }
  }

  transactionsData: any[] = [];
  sendDataToAPI(data: any) {
    console.log(this.voucher_type?.value);
    const transactions = this.transactions.map((transaction) => {
      return {
        description: transaction.description,
        account: transaction.account,
        vocuher_type: transaction.voucher_type,
        debit: transaction.debit,
        credit: transaction.credit,
      };
    });

    // console.log(this.voucher_type?.value);
    const requestBody = {
      transaction_date: this.date?.value,
      transactions: transactions,
      vocuher_type: this.voucher_type?.value,
    };

    const apiUrl = 'http://127.0.0.1:8000/inventory/vouchar/';

    console.log(JSON.stringify(requestBody));
    this.http.post(apiUrl, requestBody).subscribe(
      (response: any) => {
        this.transactionsData = response;
        console.log('Data sent successfully:', response);
      },
      (error: any) => {
        console.error('Error occurred while sending data:', error);
      }
    );
  }

  isComplete: boolean = false;
  transaction_order_res: any[] = [];
  // <------------------------------------ code for refreshing page -------------------------------------------->

  refreshPage() {
    window.location.reload();
  }
}
