import { TestBed } from '@angular/core/testing';

import { SyntacticAnalyzerService } from './syntactic-analyzer.service';

describe('SyntacticAnalyzerService', () => {
  let service: SyntacticAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyntacticAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
