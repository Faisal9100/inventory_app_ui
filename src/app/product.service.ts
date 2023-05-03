import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  // public ip_address = ' 192.168.1.9:8000 ';

  constructor(public http: HttpClient) {}

  public url = 'http://192.168.1.9:8000/inventory/products/';

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
