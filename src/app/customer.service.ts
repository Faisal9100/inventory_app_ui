import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(public http: HttpClient, public api: LocalhostApiService) {}
  public url = this.api.localhost + '/inventory/customers/';

  getAllPurchase(): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `JWT  ${localStorage.getItem('token')}`, // Access token stored in localStorage
      }),
    };
    return this.http.get<any>(this.url, httpOptions);
  }
}
