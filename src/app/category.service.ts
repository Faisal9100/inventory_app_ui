import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  public ip_address= "127.0.0.1:8000";

  private url2 = "http://"+ this.ip_address +"/inventory/categories/${id}";
  public url = "http://"+ this.ip_address +"/inventory/categories/";
 
  constructor(private http: HttpClient) {}
  //  code for categories
  getCategories(pageIndex: number, pageSize: number): Observable<any> {
    return this.http.get<any>(this.url);
  }
  searchCategories(query: string): Observable<any> {
    return this.http.get(`${this.url}?search=${query}`);
  }
  
  addCategory(category: any): Observable<any> {
    return this.http.post<any>(this.url, category);
  }
  createCategory(id:number, name: string) {
    const data = { id , name };
    return this.http.post(this.url, data);
  }
  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.url}${id}`);
  }
  putCategory(category: any): Observable<any> {
    const url = `${this.url2}/${category.id}`;
    return this.http.put<any>(url, category);
  }
  // categories code ended
  public url3 = 'http://127.0.0.1:8000/inventory/products/';


  getProducts(): Observable<any> {
    return this.http.get<any>(this.url3);
  }
}
