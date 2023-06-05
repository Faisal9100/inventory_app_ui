import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalhostApiService {

  constructor() { }
  localhost = '192.168.1.9:8000'
}
