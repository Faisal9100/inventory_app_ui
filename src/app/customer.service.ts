import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(public http:HttpClient) { }
  public ip_address = '127.0.0.1:8000';
  public url = 'http://' + this.ip_address + '/inventory/customers/';
  
  getAllPurchase(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
