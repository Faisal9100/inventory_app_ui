import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  searchUnits(searchQuery: string) {
    throw new Error('Method not implemented.');
  }
  getUnits(pageIndex: number, pageSize: number) {
    throw new Error('Method not implemented.');
  }
  unshift(newCategory: { name: any }) {
    throw new Error('Method not implemented.');
  }
  public ip_address = '' + this.api.localhost + '';

  private url2 = 'http://' + this.api.localhost + '/inventory/categories/${id}';
  public url = 'http://' + this.api.localhost + '/inventory/categories/';

  constructor(private http: HttpClient, public api: LocalhostApiService) {}
  //  code for categories
  getCategories(pageIndex: number, pageSize: number): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    return this.http.get<any>(this.url, httpOptions);
  }
  searchCategories(query: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    return this.http.get(`${this.url}?search=${query}`, httpOptions);
  }

  addCategory(category: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    return this.http.post<any>(this.url, category, httpOptions);
  }
  createCategory(id: number, name: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    const data = { id, name };
    return this.http.post(this.url, data, httpOptions);
  }
  deleteCategory(id: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    return this.http.delete(`${this.url}${id}`, httpOptions);
  }
  putCategory(category: any): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    const url = `${this.url2}/${category.id}`;
    return this.http.put<any>(url, category, httpOptions);
  }
  // categories code ended
  public url3 = 'http://' + this.api.localhost + '/inventory/products/';

  getProducts(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    return this.http.get<any>(this.url3, httpOptions);
  }
}
