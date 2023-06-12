import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalhostApiService {
  constructor() {}
  // localhost: string = '54.152.77.92';
  localhost = '127.0.0.1:8000';
}
