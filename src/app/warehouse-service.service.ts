import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WarehouseServiceService {

  constructor(private httpService: HttpClient) { }
  getData() {
    return this.httpService.get
    ("http://127.0.0.1:8000/inventory/warehouses/");
   }
}
