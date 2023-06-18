import { HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  constructor(private http: HttpClient) {}
  @Input('data') data: any;

  loadNext(data: any) {
    this.http.get(data.next).subscribe((res: any) => {
      data['results'] = res['results'];
      data['next'] = res['next'];
      data['previous'] = res['previous'];
      data['current'] += 1;
    });
  }
  loadPrev(data: any) {
    this.http.get(data.previous).subscribe((res: any) => {
      data['results'] = res['results'];
      data['next'] = res['next'];
      data['previous'] = res['previous'];
      data['current'] -= 1;
    });
  }
  loadPage(pageNumber: number) {
  
    this.http.get(this.data.pageNumber).subscribe((res: any) => {
      this.data.results = res.results;
      this.data.next = res.next;
      this.data.previous = res.previous;
      this.data.current = pageNumber;
    });
  }
}
