import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, skip } from 'rxjs';
import { Product } from './units/units.component';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  public url = this.api.localhost + 'inventory/units/';
  public url2 = this.api.localhost + '/inventory/units/${id}';

  getproducts(pageIndex: any, pageSize: number) {
    throw new Error('Method not implemented.');
  }

  deleteCategory(unitId: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient, public api: LocalhostApiService) {}

  // code for unit
  getUnit(): Observable<any> {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers = headers.append('Authorization', 'JWT' + token);
    let options = { headers: headers };
    return this.http.get<any>(this.url, options);
  }

  addUnit(category: any): Observable<any> {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers = headers.append('Authorization', 'JWT' + token);
    let options = { headers: headers };
    return this.http.post<any>(this.url, category, options);
  }
  createUnit(id: number, name: string) {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers = headers.append('Authorization', 'JWT' + token);
    let options = { headers: headers };
    const data = { id, name };
    return this.http.post(this.url, data, options);
  }
  deleteUnit(id: string): Observable<any> {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers = headers.append('Authorization', 'JWT' + token);
    let options = { headers: headers };
    return this.http.delete(`${this.url}${id}`, options);
  }
  putProduct(product: Product): Observable<any> {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers = headers.append('Authorization', 'JWT' + token);
    let options = { headers: headers };
    const url = `${this.url}${product.id}/`;
    return this.http.put<any>(url, { name: product.name }, options);
  }
  getProducts(): Observable<any> {
    let headers = new HttpHeaders();
    let token = localStorage.getItem('token');
    headers = headers.append('Authorization', 'JWT' + token);
    let options = { headers: headers };
    return this.http.get<any>(this.url, options);
  }
  // unit code ended
}
