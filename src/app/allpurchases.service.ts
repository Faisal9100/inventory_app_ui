import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AllpurchasesService {

  constructor(public http:HttpClient) { }
  // public ip_address='192.168.1.9:8000'
  public url ="http://192.168.1.9:8000/inventory/stocks_purchase";
  getAllPurchase(): Observable<any> {
    return this.http.get<any>(this.url);
  }
}
