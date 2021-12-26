import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { SymbolTable } from './symbol-table';

/**
 * Sentence representation
 */
export class Sentence {

  public saveSymbolTable(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void { }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void { }

  public getTreeNode(): TreeNode {
    return new TreeNode('Sentencia', []);
  }
}
