import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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
  pageSize?: number;
  currentPage = 1;
  totalPages!: number;
  pages: number[] = [];
  totalItems: any;
  itemsPerPage: any;

  selectedMainLayer: any;

  
  public url_layer2 = this.api.localhost + '/inventory/layer1s';
  
  private url_layer1 = this.api.localhost + '/inventory/layer1s';
  
  constructor(private http: HttpClient, public api: LocalhostApiService) {}
  page?: number;
  
  public changeLayer = this.api.localhost + '/inventory/accounts/';
  
  // public url = this.api.localhost + '/inventory/accounts';

  // getAccounts(): Observable<any> {
  //   return this.http.get(this.url).pipe(catchError(this.handleError));
  // }
  public url = this.api.localhost + '/inventory/accounts';

getAccounts(mainLayer?: string, layer1?: number, layer2?: number): Observable<any> {
  let params = new HttpParams();

  if (mainLayer) {
    params = params.set('main_layer', mainLayer);
  }

  if (layer1) {
    params = params.set('layer1_id', layer1.toString());
  }

  if (layer2) {
    params = params.set('layer2_id', layer2.toString());
  }

  return this.http.get(this.url, { params }).pipe(catchError(this.handleError));
}


  getLayer1(selectedMainLayer: any): Observable<any> {
    return this.http
      .get(`${this.url_layer1}?main_layer=${selectedMainLayer}`)
      .pipe(catchError(this.handleError));
  }
  getMainData(selectedMainLayer2: any) {
    return this.http
      .get(`${this.changeLayer}?main_layer=${selectedMainLayer2}`)
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
