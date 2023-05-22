import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {

  constructor(public http:HttpClient) { }
  ip_address = '127.0.0.1:8000';
  
  public url = "http://127.0.0.1:8000/inventory/sales/";
  
  
  public stock_url = 'http://' + this.ip_address + 'inventory/sales/${purchaseId}/sale_items';
  
  public warehouse_url = "http://127.0.0.1:8000/inventory/warehouses/";
  
  public product_url = 'http://' + this.ip_address + '/inventory/products/';
  
  public customer_url = 'http:/127.0.0.1:8000/inventory/customers/';
  
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
