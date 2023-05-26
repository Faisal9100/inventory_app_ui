import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  VOUCHAR_TYPE = [
    ['Bank Payment', 'Bank Payment'],
    [2, 'Bank Receipt'],
    ['Cash Payment', 'Cash Payment'],
    ['Cash Receipt', 'Cash Receipt'],
  ];
  // ('Cash Payment', 'Cash Payment'),
  //       ('Bank Payment', 'Bank Payment'),
  //       ('Cash Receipt', 'Cash Receipt'),
  //       ('Bank Receipt', 'Bank Receipt'),
  constructor() { }
}
