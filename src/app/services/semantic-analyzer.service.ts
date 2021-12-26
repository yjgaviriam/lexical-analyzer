import { Injectable } from '@angular/core';
import { CompilationUnit } from '../entities/compilation-unit';
import { SemanticError } from '../entities/semantic-error';
import { SymbolTable } from '../entities/symbol-table';

@Injectable({
  providedIn: 'root'
})
export class SemanticAnalyzerService {

  public semanticErrors: SemanticError[];
  public symbolTable: SymbolTable;

  constructor() {
    this.resetValues();
  }

  public saveSymbols(compilationUnit: CompilationUnit): void {
    compilationUnit.saveSymbolTable(this.symbolTable, this.semanticErrors);
  }

  public analyze(compilationUnit: CompilationUnit): void {
    compilationUnit.analyzeSemantic(this.symbolTable, this.semanticErrors);
  }

  public resetValues(): void {
    this.semanticErrors = [];
    this.symbolTable = new SymbolTable(this.semanticErrors);
  }
}
