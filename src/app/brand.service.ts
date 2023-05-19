import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
public ip_address="192.168.1.9:8000"
  private url2 = "http://" + this.ip_address +"/inventory/brands/${id}";
  public url = "http://" + this.ip_address +"/inventory/brands/";

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
  public url3 = 'http://192.168.1.9:8000/inventory/products/';


  getProducts(): Observable<any> {
    return this.http.get<any>(this.url3);
  }
}
