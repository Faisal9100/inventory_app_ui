import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {

  constructor(public http: HttpClient) {}
  public url = 'http://127.0.0.1:8000/inventory/products/';


  getProducts(): Observable<any> {
    return this.http.get<any>(this.url);
  }
  addProduct(formData:FormData): Observable<any> {
    return this.http.post<any>(this.url, FormData);
  }
  
  // addProduct(formData: FormData) {
  //   const url = 'http://127.0.0.1:8000/inventory/products/'; // replace with your API endpoint
   
  //   return this.http.post(url, formData);
  // }
  
    
}
