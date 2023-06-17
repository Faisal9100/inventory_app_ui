import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalhostApiService {
  constructor() {}
  // localhost = 'http://54.152.77.92';
  localhost = 'http://192.168.1.9:8000';
  // localhost = 'http://127.0.0.1:8000/';

  addCount(data: any) {
    let pageSize = 1;
    let pages = Math.ceil(data['count'] / pageSize);
    let nums: any[] = [];
    for (let i = 1; i <= pages; i++) nums.push(i);
    data['pages'] = nums;
    data['current'] = 1;
  }
}
