import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(public http: HttpClient,public api:LocalhostApiService) {}
  public url =  this.api.localhost+ '/inventory/products/';

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
  updateProduct(id: any, product: any): Observable<any> {
    const url = `${this.url}${id}`;
    return this.http.put(url, product);
  }
}
