import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseServiceService {
public ip_address = "127.0.0.1:8000";

  constructor(private httpService: HttpClient) { }
  getData() {
    return this.httpService.get
    ("http://" + this.ip_address + "/inventory/warehouses/");
   }
}
