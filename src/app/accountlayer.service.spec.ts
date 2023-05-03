import { TestBed } from '@angular/core/testing';

import { AccountlayerService } from './accountlayer.service';

describe('AccountlayerService', () => {
  let service: AccountlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
