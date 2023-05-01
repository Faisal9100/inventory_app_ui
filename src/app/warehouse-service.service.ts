import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseServiceService {
public ip_address = "192.168.1.9:8000";

  constructor(private httpService: HttpClient) { }
  getData() {
    return this.httpService.get
    ("http://" + this.ip_address + "/inventory/warehouses/");
   }
}
