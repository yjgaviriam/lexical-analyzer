import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { SymbolTable } from './symbol-table';
import { Token } from './token';
import { ReservedWord } from '../enums/reserved-word';

/**
 * Declaration representation
 */
export class Declaration {

  public dataType: Token;
  public nameVariable: Token;
  public type: Token;

  constructor(nameVariable: Token, dataType: Token, type: Token) {
    this.nameVariable = nameVariable;
    this.dataType = dataType;
    this.type = type;
  }

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Declaración', []);
    root.children.push(new TreeNode(`${this.type.lexeme} ${this.nameVariable.lexeme} :  ${this.dataType.lexeme}`, []));
    return root;
  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[]): void {
  }

  public saveSymbolTable(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {
    symbolTable.saveSymbolValue(this.nameVariable.lexeme, this.dataType.lexeme, ambit, this.nameVariable.row,
      this.nameVariable.column, this.type.lexeme === ReservedWord.MUTABLE);
  }
}
