import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountlayerService {
  public ip_address = '192.168.1.9:8000';
  public url = 'http://' + this.ip_address + '/inventory/layer2s/2/accounts';
  public url_layer1 =
    'http://' + this.ip_address + '/inventory/layer1s/?main_layer=assets';
    
  public url_layer2 =
    'http://' + this.ip_address + '/inventory/layer1s/1/layer2s';
    
  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any> {
    return this.http.get(this.url);
  }
  // mainAccounts(): Observable<any> {
  //   return this.http.get(this.url);
  // }
  getLayer1(): Observable<any> {
    return this.http.get(this.url_layer1);
  }
  getLayer2(): Observable<any> {
    return this.http.get(this.url_layer2);
  }
}
