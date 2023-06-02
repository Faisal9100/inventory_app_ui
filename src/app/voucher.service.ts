import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  [x: string]: any;
  VOUCHAR_TYPE = [
    [1, 'Bank Payment'],
    [2, 'Bank Receipt'],
    [3, 'Cash Payment'],
    [4, 'Cash Receipt'],
  ];
  constructor() { }
}
