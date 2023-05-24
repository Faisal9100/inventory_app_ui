import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, skip } from 'rxjs';
import { Product } from './units/units.component';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  public ip_address = '127.0.0.1:8000';
  public url = 'http://' + this.ip_address + '/inventory/units/';
  public url2 = 'http://' + this.ip_address + '/inventory/units/${id}';

  getproducts(pageIndex: any, pageSize: number) {
    throw new Error('Method not implemented.');
  }

  deleteCategory(unitId: string) {
    throw new Error('Method not implemented.');
  }

  constructor(private http: HttpClient) {}

  // code for unit
  getUnit(): Observable<any> {
    return this.http.get<any>(this.url);
  }
  // searchUnit(query: string): Observable<any> {
  //   return this.http.get(`${this.url}?search=${query}`);
  // }

  addUnit(category: any): Observable<any> {
    return this.http.post<any>(this.url, category);
  }
  createUnit(id: number, name: string) {
    const data = { id, name };
    return this.http.post(this.url, data);
  }
  deleteUnit(id: string): Observable<any> {
    return this.http.delete(`${this.url}${id}`);
  }
  putProduct(product: Product): Observable<any> {
    const url = `${this.url}${product.id}/`;
    return this.http.put<any>(url, { name: product.name });
  }
  getProducts(): Observable<any> {
    return this.http.get<any>(this.url);
  }
  // unit code ended
}
