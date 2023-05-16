import { TestBed } from '@angular/core/testing';

import { AuthQuardGuard } from './auth-quard.guard';

describe('AuthQuardGuard', () => {
  let guard: AuthQuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthQuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
