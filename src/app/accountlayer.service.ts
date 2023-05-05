import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from './accountlayer/accountlayer.component';

@Injectable({
  providedIn: 'root',
})
export class AccountlayerService {

  accountAdded = new EventEmitter<Account>();
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  totalItems: any;
  itemsPerPage: any;
  public ip_address = '192.168.1.9:8000';

  selectedMainLayer: any;

  public url = 'http://' + this.ip_address + '/inventory/accounts';

  public url_layer2 = 'http://' + this.ip_address + '/inventory/layer1s';

  private url_layer1 = 'http://' + this.ip_address + '/inventory/layer1s';

  constructor(private http: HttpClient) {}
  
  getAccounts(): Observable<any> {
    let skip = (this.currentPage - 1) * this.pageSize;

    let limit = 20;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;
    return this.http.get(url);
  }

  getLayer1(selectedMainLayer: any): Observable<any> {
    return this.http.get(`${this.url_layer1}?main_layer=${selectedMainLayer}`);
  }

  getLayer2(selectedLayer1: any): Observable<any> {
    const url = `${this.url_layer2}/${selectedLayer1}/layer2s`;
    return this.http.get(url);
  }
}
