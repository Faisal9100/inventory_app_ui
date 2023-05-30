import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  ip_address = '127.0.0.1:8000';
  public url = 'http://' + this.ip_address + '/inventory/Suppliers/';
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  totalItems: any;
  itemsPerPage: any;
  suppliers: any;
  constructor(public http: HttpClient) {}
  fetchsupplier() {
    let skip = (this.currentPage - 1) * this.pageSize;
    let limit = 20;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;

    return this.http.get<any>(url).pipe(
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
