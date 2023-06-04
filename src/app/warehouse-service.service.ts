import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WarehouseServiceService {
  public ip_address = '127.0.0.1:8000';

  constructor(private httpService: HttpClient) {}
  getData() {
    const token = localStorage.getItem('token');
    const accessKey = 'access'; // Replace with your access key
  
    const headers = new HttpHeaders({
      'Authorization': 'JWT ' + token,
      'access-key': accessKey
    });
  
    const options = { headers }
    return this.httpService.get(
      'http://' + this.ip_address + '/inventory/warehouses/',options
    );
  }
}
