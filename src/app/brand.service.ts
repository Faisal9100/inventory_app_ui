import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService {

  private url2 = 'http://127.0.0.1:8000/inventory/brands/${id}';
  public url = 'http://127.0.0.1:8000/inventory/brands/';

  constructor(private http: HttpClient) {}
  //  code for brand
  getBrand(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.url);
  }
  createBrand(id:number, name: string) {
    const data = { id , name };
    return this.http.post(this.url, data);
  }
  searchBrand(query: string): Observable<any> {
    return this.http.get(`${this.url}?search=${query}`);
  }

  addBrand(category: any): Observable<any> {
    return this.http.post<any>(this.url, category);
  }
  deleteBrand(id: string): Observable<any> {
    return this.http.delete(`${this.url}${id}`);
  }
  putBrand(category: any): Observable<any> {
    const url = `${this.url2}/${category.id}`;
    return this.http.put<any>(url, category);
  }
  // brand code ended
  public url3 = 'http://127.0.0.1:8000/inventory/products/';


  getProducts(): Observable<any> {
    return this.http.get<any>(this.url3);
  }
}
