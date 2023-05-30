import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  public ip_address = '127.0.0.1:8000';

  public url = 'http://' + this.ip_address + '/inventory/accounts';
  constructor(private http: HttpClient) {}

  getTransactions(fromDate: string, toDate: string, accountId: string) {
    const url = `http://127.0.0.1:8000/inventory/transactions/?from_date=${fromDate}&to_date=${toDate}&account_id=${accountId}`;
    return this.http.get(url);
  }
  getAccounts(): Observable<any> {
    const account_url = 'http://' + this.ip_address + '/inventory/accounts';
    return this.http.get(account_url);
  }
  // getStock_trans_detail(id: any) {
  //   const url = `http://127.0.0.1:8000/inventory/transactions_order/${id}/details/`;
  //   return this.http.get(url);
  // }
}
