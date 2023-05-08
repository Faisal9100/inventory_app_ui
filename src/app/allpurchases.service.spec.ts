import { TestBed } from '@angular/core/testing';

import { AllpurchasesService } from './allpurchases.service';

describe('AllpurchasesService', () => {
  let service: AllpurchasesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllpurchasesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
