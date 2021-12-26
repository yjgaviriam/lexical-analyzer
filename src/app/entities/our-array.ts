import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { Sentence } from './sentence';
import { SymbolTable } from './symbol-table';
import { Token } from './token';

/**
 * Representation of our array
 */
export class OurArray extends Sentence {

  public nameIdentifier: Token;
  public dataType: Token;

  constructor(nameIdentifier: Token, dataType: Token) {
    super();
    this.nameIdentifier = nameIdentifier;
    this.dataType = dataType;
  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {

  }


  public saveSymbolTable(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {
    symbolTable.saveSymbolValue(this.nameIdentifier.lexeme, this.dataType.lexeme, ambit, this.nameIdentifier.row,
      this.nameIdentifier.column, true);
  }

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Arreglo', [
      new TreeNode(`${this.nameIdentifier.lexeme}: ${this.dataType.lexeme}`, []),
    ]);
    return root;
  }
}
