import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllpurchasesService {
  constructor(public http: HttpClient) {}
  // public ip_address='192.168.1.9:8000'
  ip_address = '192.168.1.9:8000';
  public supplier_url = 'http://' + this.ip_address + '/inventory/Suppliers/';

  public url = 'http://' + this.ip_address + '/inventory/stocks_purchase';

  public stock_url = 'http://' + this.ip_address + 'inventory/stocks_purchase/${purchaseId}/stocks';

  public warehouse_url = "http://192.168.1.9:8000/inventory/warehouses/";

  public product_url = 'http://' + this.ip_address + '/inventory/products/';

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
