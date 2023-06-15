import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class WarehouseServiceService {
  public ip_address = '127.0.0.1:8000';

  constructor(
    private httpService: HttpClient,
    public api: LocalhostApiService
  ) {}
  getData() {
    const token = localStorage.getItem('token');
    const accessKey = 'access'; // Replace with your access key

    const headers = new HttpHeaders({
      Authorization: 'JWT ' + token,
      'access-key': accessKey,
    });

    const options = { headers };
    return this.httpService.get(
      this.api.localhost + '/inventory/warehouses/',
      options
    );
  }
}
