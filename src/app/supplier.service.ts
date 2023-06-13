import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  public url = 'http://' + this.api.localhost + '/inventory/Suppliers/';
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  totalItems: any;
  itemsPerPage: any;
  suppliers: any;
  constructor(
    public http: HttpClient,
    public api: LocalhostApiService,
    public auth: AuthService
  ) {}
  fetchsupplier() {
    let skip = (this.currentPage - 1) * this.pageSize;
    let limit = 20;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;
    let token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'JWT ' + token);
    // console.log(token);
    //  let options = new RequestOptions({headers:headers});
    return this.http.get<any>(url, { headers: headers }).pipe(
      map((response) => {
        this.suppliers = <any>response.results;
        this.totalPages = Math.ceil(response.count / this.pageSize);
        this.totalItems = response.count;
        this.pages = Array.from(Array(this.totalPages), (_, i) => i + 1);

        return response;
      })
    );
  }
}
