import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class AllpurchasesService {
  constructor(public http: HttpClient,public api:LocalhostApiService) {}
 
  public supplier_url =  this.api.localhost + '/inventory/Suppliers/';

  public url =  this.api.localhost + '/inventory/stocks_purchase';

  public stock_url =
    
    this.api.localhost +
    'inventory/stocks_purchase/${purchaseId}/stocks';

  public warehouse_url = 'http://'+this.api.localhost+'/inventory/warehouses/';

  public product_url =  this.api.localhost + '/inventory/products/';

  getAllPurchase(): Observable<any> {
    return this.http.get<any>(this.url);
  }
  getStockpurchase(): Observable<any> {
    return this.http.get<any>(this.stock_url);
  }
  getSupplier(): Observable<any> {
    return this.http.get<any>(this.supplier_url);
  }
  getWarehouse(): Observable<any> {
    return this.http.get<any>(this.warehouse_url);
  }
  getProduct() {
    return this.http.get<any>(this.product_url);
  }
  addPurchase(formData: FormData): Observable<any> {
    return this.http.post(this.url, formData);
  }
}
