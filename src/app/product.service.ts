import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // public ip_address = ' 127.0.0.1:8000 ';

  constructor(public http: HttpClient) {}
  public ip_address = '127.0.0.1:8000';
  public url = 'http://' + this.ip_address + '/inventory/products/';

  getProducts(): Observable<any> {
    return this.http.get<any>(this.url);
  }
  addProduct(formData: FormData): Observable<any> {
    return this.http.post(this.url, formData);
  }

  deleteProduct(id: number): Observable<any> {
    const deleteUrl = `${this.url}${id}`;
    return this.http.delete<any>(deleteUrl);
  }
  updateProduct(id: any, formData: any): Observable<any> {
    const url = `${this.url}${id}`;
    return this.http.put(url, formData);
  }
}
