import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TransactionService } from '../transaction.service';
import { AccountlayerService } from '../accountlayer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { LocalhostApiService } from '../localhost-api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css'],
})
export class TransactionsComponent {
  form: FormGroup;
  constructor(
    public transaction: TransactionService,
    public accounts: AccountlayerService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private http: HttpClient,
    public api: LocalhostApiService
  ) {
    this.getAccounts();
    // this.get_Stock_trans_details(this.s);
    // this.getTransactions();
    this.form = this.formBuilder.group({
      fromDate: [''],
      toDate: [''],
      accountId: [''],
    });
  }

  accountData: any[] = [];
  getAccounts() {
    this.transaction.getAccounts().subscribe((data) => {
      this.accountData = data.results;
    });
  }

  transactions: any[] = [];
  submitForm() {
    if (this.form.valid) {
      const fromDate = this.form.get('fromDate')?.value;
      const toDate = this.form.get('toDate')?.value;
      const accountId = this.form.get('accountId')?.value;

      this.transaction.getTransactions(fromDate, toDate, accountId).subscribe(
        (response: any) => {
          if (response && response.results) {
            this.transactions = response.results;
            console.log(this.transactions);
          } else {
            console.error('Invalid response format');
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
  open(content3: any) {
    this.modalService.open(content3, { size: 'lg', centered: true });
  }
  accountId: any;
  stock_trans: any[] = [];

  get_Stock_trans_details(item: number) {
    this.http
      .get(
        `http://` +
          this.api.localhost +
          `/inventory/transactions_order/${item}/details/`
      )
      .subscribe((resp: any) => {
        const { data, transactions, stocks } = resp;

        this.transactionData = data;
        this.transaction_data = transactions;
        this.stocks = stocks;

        console.log(resp);
      });
  }

  stocks: any[] = [];
  // data:any[]=[];
  transactionData: any;
  transaction_data: any[] = [];
}
