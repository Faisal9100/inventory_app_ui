import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(public http: HttpClient,public api:LocalhostApiService) {}
 

  public url = 'http://'+this.api.localhost+'/inventory/sales/';

  public stock_url =
    'http://' + this.api.localhost + 'inventory/sales/${purchaseId}/sale_items';

  public warehouse_url = 'http://'+this.api.localhost+'/inventory/warehouses/';

  public product_url = 'http://' + this.api.localhost + '/inventory/products/';

  public customer_url = 'http:/'+this.api.localhost+'/inventory/customers/';

  getAllPurchase(): Observable<any> {
    return this.http.get<any>(this.url);
  }
  getStockpurchase(): Observable<any> {
    return this.http.get<any>(this.stock_url);
  }
  getSupplier(): Observable<any> {
    return this.http.get<any>(this.customer_url);
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
