import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

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
  constructor(public http: HttpClient, public api: LocalhostApiService) {}
  fetchsupplier() {
    let skip = (this.currentPage - 1) * this.pageSize;
    let limit = 20;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;
    let token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2MDg5NDIxLCJqdGkiOiIyY2IxODExZWU3MTY0ZTIxYTZlMDIzYmMxMGM5MGJhZSIsInVzZXJfaWQiOjJ9.1x2SsvDT7Z7gdzJkNIVdU37h6i2fRWmJ_yz4NfPnShk';
    let head_obj = new HttpHeaders().set('Authorization', 'JWT' + token);
    return this.http.get<any>(url, { headers: head_obj }).pipe(
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
