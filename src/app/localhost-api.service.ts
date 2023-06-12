import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalhostApiService {
  constructor() {}
  // localhost = '54.152.77.92';
  localhost = '192.168.1.9:8000';
}
