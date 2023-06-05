import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class BrandService {
  private url2 = 'http://' + this.api.localhost + '/inventory/brands/${id}';
  public url = 'http://' + this.api.localhost + '/inventory/brands/';

  constructor(private http: HttpClient,public api:LocalhostApiService) {}
  //  code for brand
  getBrand(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.url);
  }
  makeHttpRequestWithHeaders() {
    // Create the headers object
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'JWT <access_token>'
    });}
  createBrand(id: number, name: string) {
    const data = { id, name };
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
  public url3 = 'http://'+this.api.localhost+'/inventory/products/';

  getProducts(): Observable<any> {
    return this.http.get<any>(this.url3);
  }
}
