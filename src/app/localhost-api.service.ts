import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalhostApiService {
  constructor() {}
  localhost = '127.0.0.1:8000';
}
