import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Account } from './accountlayer/accountlayer.component';
import { LocalhostApiService } from './localhost-api.service';

@Injectable({
  providedIn: 'root',
})
export class AccountlayerService {
  filter(
    arg0: (account: { sub_layer_keyword: string }) => boolean
  ): AccountlayerService {
    throw new Error('Method not implemented.');
  }
  accountAdded = new EventEmitter<Account>();
  pageSize = 10;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  totalItems: any;
  itemsPerPage: any;
  public ip_address = '127.0.0.1:8000';

  selectedMainLayer: any;

  public url = 'http://' + this.api.localhost + '/inventory/accounts';

  public url_layer2 = 'http://' + this.api.localhost + '/inventory/layer1s';

  private url_layer1 = 'http://' + this.api.localhost + '/inventory/layer1s';

  constructor(private http: HttpClient, public api: LocalhostApiService) {}

  getAccounts(): Observable<any> {
    let skip = (this.currentPage - 1) * this.pageSize;

    let limit = 20;
    let url = `${this.url}?skip=${skip}&limit=${limit}`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }

  getLayer1(selectedMainLayer: any): Observable<any> {
    return this.http
      .get(`${this.url_layer1}?main_layer=${selectedMainLayer}`)
      .pipe(catchError(this.handleError));
  }
  // postAddLayer1(selectedMainLayer: any): Observable<any> {
  //   return this.http.post(`${this.url_layer1}?main_layer=${selectedMainLayer}`);
  // }
  postLayer1(selectedMainLayer: any): Observable<any> {
    const requestBody = {
      main_layer: selectedMainLayer,
    };

    return this.http
      .post(this.url_layer1, requestBody)
      .pipe(catchError(this.handleError));
  }

  getLayer2(selectedLayer1: any): Observable<any> {
    const url = `${this.url_layer2}/${selectedLayer1}/layer2s`;
    return this.http.get(url).pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error occurred
      console.error('An error occurred:', error.error.message);
    } else {
      // API returned an error response
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    // Return an observable with a user-facing error message
    return throwError('Something went wrong. Please try again later.');
  }
}
