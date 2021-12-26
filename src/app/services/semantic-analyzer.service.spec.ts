import { TestBed } from '@angular/core/testing';

import { SemanticAnalyzerService } from './semantic-analyzer.service';

describe('SemanticAnalyzerService', () => {
  let service: SemanticAnalyzerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemanticAnalyzerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
