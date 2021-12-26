import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { SymbolTable } from './symbol-table';

/**
 * Expression representation
 */
export class Expression {

  public getTreeNode(): TreeNode {
    return new TreeNode('Expresión', []);
  }

  public getType(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): string {
    return '';
  }
}
