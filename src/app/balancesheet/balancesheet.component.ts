import { Component } from '@angular/core';
import { LocalhostApiService } from '../localhost-api.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.css'],
})
export class BalancesheetComponent {
  constructor(public api: LocalhostApiService, public http: HttpClient) {
    this.getBalanceSheet();
  }
  public url = this.api.localhost + '/inventory/balancesheet/';
  balanceSheet: any[] = [];
  getBalanceSheet() {
    this.http.get(this.url).subscribe((res) => {
      this.balanceSheet = res as any[];
      console.log(this.balanceSheet);
    });
  }
}
