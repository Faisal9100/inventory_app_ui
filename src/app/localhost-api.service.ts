import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalhostApiService {
  constructor() {}
  // localhost = '54.152.77.92';
  localhost = 'http://127.0.0.1:8000';
  // localhost = 'http://127.0.0.1:8000/';
}
