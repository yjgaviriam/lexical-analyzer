import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { Sentence } from './sentence';
import { SymbolTable } from './symbol-table';
import { Token } from './token';

/**
 * Return representation
 */
export class Return extends Sentence {

  public identifier: Token;

  constructor(identifier: Token) {
    super();
    this.identifier = identifier;
  }

  public getTreeNode(): TreeNode {
    return new TreeNode(`Retorno: ${this.identifier.lexeme}`, []);
  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {
    const s = symbolTable.searchSymbolValue(this.identifier.lexeme, ambit);

    if (s === null) {
      semanticErrors.push(new SemanticError(`El campo ${this.identifier.lexeme} no existe dentro del ambito ${ambit}`,
        this.identifier.row, this.identifier.column));
    }
  }
}
