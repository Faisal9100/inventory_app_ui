import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
;

  public url =  this.api.localhost + '/inventory/accounts';
  constructor(private http: HttpClient,public api:LocalhostApiService) {}

  getTransactions(fromDate: string, toDate: string, accountId: string) {
    const url =  this.api.localhost +`/inventory/transactions/?from_date=${fromDate}&to_date=${toDate}&account_id=${accountId}`;
    return this.http.get(url);
  }
  getAccounts(): Observable<any> {
    const account_url =  this.api.localhost + '/inventory/accounts';
    return this.http.get(account_url);
  }
  // getStock_trans_detail(id: any) {
  //   const url = `http://'`t his.api.localhost+  `/inventory/transactions_order/${id}/details/`;
  //   return this.http.get(url);
  // }
}
