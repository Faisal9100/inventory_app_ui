import { TestBed } from '@angular/core/testing';

import { LocalhostApiService } from './localhost-api.service';

describe('LocalhostApiService', () => {
  let service: LocalhostApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalhostApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
