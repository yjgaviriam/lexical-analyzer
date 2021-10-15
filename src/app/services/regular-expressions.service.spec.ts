import { TestBed } from '@angular/core/testing';

import { RegularExpressionsService } from './regular-expressions.service';

describe('RegularExpressionsService', () => {
  let service: RegularExpressionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RegularExpressionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
