import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountlayerService {
  public ip_address = '192.168.1.9:8000';
  selectedMainLayer: any;
// selectedLayer1: any;
  public url = 'http://' + this.ip_address + '/inventory/accounts';
  public   create_account_url = 'http://' + this.ip_address + '/inventory/layer2s/2/accounts';

  // public url_layer1 =
  //   'http://'+this.ip_address+'/inventory/layer1s/?main_layer=liability';

  public url_layer2 ='http://' + this.ip_address +'/inventory/layer1s';

    private url_layer1 = 'http://' + this.ip_address + '/inventory/layer1s';

  constructor(private http: HttpClient) {}

  getAccounts(): Observable<any> {
    return this.http.get(this.url);
  }
  // mainAccounts(): Observable<any> {
  //   return this.http.get(this.url);
  // }
  getLayer1(selectedMainLayer:any): Observable<any> {
    return this.http.get(`${this.url_layer1}?main_layer=${selectedMainLayer}`);
    
  }

  
  getLayer2(selectedLayer1:any): Observable<any> {
    const url = `${this.url_layer2}/${selectedLayer1}/layer2s`;
    return this.http.get(url);
  }
}
