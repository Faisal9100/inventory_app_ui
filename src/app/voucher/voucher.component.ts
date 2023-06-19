import { LocalhostApiService } from './../localhost-api.service';
import { Component, OnInit } from '@angular/core';
import { VoucherService } from '../voucher.service';
import { AccountlayerService } from '../accountlayer.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

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
    public http: HttpClient,
    public api: LocalhostApiService
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
    // date: new FormControl('', Validators.required),
    date: new FormControl(new Date().toISOString().substring(0, 10)),
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
  addTransaction() {
    if (this.form.valid) {
      const data: any = {};
      data['date'] = this.form.value.date;
      data['voucher_type'] = this.form.value.voucher_type;
      data['account'] = this.form.value.account;
      data['description'] = this.form.value.description;
      data['amount'] = this.form.value.amount;
      // console.log(data);
  
      if (
        (this.form.value.voucher_type === 'Cash Payment' ||
          this.form.value.voucher_type === 'Bank Payment') &&
        this.transactionCount === 0
      ) {
        data['debit'] = this.form.value.amount;
        data['credit'] = 0;
      } else if (
        (this.form.value.voucher_type === 'Cash Receipt' ||
          this.form.value.voucher_type === 'Bank Receipt') &&
        this.transactionCount === 0
      ) {
        data['credit'] = this.form.value.amount;
        data['debit'] = 0;
      } else if (this.transactionCount === 1) {
        if (
          (this.transactions[0]['voucher_type'] === 'Cash Receipt' ||
            this.transactions[0]['voucher_type'] === 'Bank Receipt')
        ) {
          data['debit'] = this.form.value.amount;
          data['credit'] = 0;
        } else {
          data['debit'] = 0;
          data['credit'] = this.form.value.amount;
        }
        // Assign date and voucher type from the first transaction
        data['date'] = this.transactions[0]['date'];
        data['voucher_type'] = this.transactions[0]['voucher_type'];
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

    const requestBody = {
      transaction_date: this.date?.value,
      transactions: transactions,
      vocuher_type: this.voucher_type?.value,
    };

    const apiUrl = this.api.localhost + '/inventory/vouchar/';

    console.log(JSON.stringify(requestBody));
    this.http.post(apiUrl, requestBody).subscribe(
      (response: any) => {
        this.transactionsData = response;
        console.log('Data sent successfully:', response);
      },
      (error: any) => {
        if (
          Array.isArray(error.error) &&
          error.error.includes(
            'Account Dual Entry in one transaction is not allowed.'
          )
        ) {
          Swal.fire({
            title: 'Error!',
            text: 'Account Dual Entry in one transaction is not allowed.',
            icon: 'error',
          });
        } else if (
          error.error &&
          error.error.Credit &&
          error.error.Credit.includes(
            "Credit can't be more than Debit in Payment"
          )
        ) {
          Swal.fire({
            title: 'Error!',
            text: "Credit can't be more than Debit in Payment",
            icon: 'error',
          });
        } else if (
          error.error === "Debit can't be more than Credit in Payment"
        ) {
          Swal.fire({
            title: 'Error!',
            text: "Debit can't be more than Credit in Payment",
            icon: 'error',
          });
        } else if (
          error.error &&
          error.error['Duplicate Entry'] &&
          error.error['Duplicate Entry'].includes(
            'Account Dual Entry in one transaction is not allowed.'
          )
        ) {
          Swal.fire({
            title: 'Error!',
            text: 'Account Dual Entry in one transaction is not allowed.',
            icon: 'error',
          });
        } else if (
          error.error &&
          error.error.Debit &&
          error.error.Debit.includes(
            "Debit can't be more than Credit in Payment"
          )
        ) {
          Swal.fire({
            title: 'Error!',
            text: "Debit can't be more than Credit in Payment",
            icon: 'error',
          });
        } else {
          // Check if any account balance is going negative
          const accountErrors = Object.keys(error.error).filter((key) => {
            const errorMessages = error.error[key];
            return errorMessages.some((message: string) =>
              message.includes(
                'Balance of this account is going to be negative'
              )
            );
          });

          if (accountErrors.length > 0) {
            // Handle account balance going negative error
            const accountName = accountErrors[0]; // Assuming there's only one account with negative balance
            Swal.fire({
              title: 'Error!',
              text: `Balance of the account '${accountName}' is going to be negative`,
              icon: 'error',
            });
          } else {
            Swal.fire({
              title: 'Error!',
              text: 'An unexpected error occurred.',
              icon: 'error',
            });
          }
        }
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
