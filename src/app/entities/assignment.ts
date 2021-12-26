import { Expression } from './expression';
import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { Sentence } from './sentence';
import { SymbolTable } from './symbol-table';
import { Token } from './token';

/**
 * Assignment representation
 */
export class Assignment extends Sentence {

  public identifier: Token;
  public expression: Expression;

  constructor(identifier: Token, expression: Expression) {
    super();
    this.identifier = identifier;
    this.expression = expression;
  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {

    const s = symbolTable.searchSymbolValue(this.identifier.lexeme, ambit);

    if (s === null) {
      semanticErrors.push(new SemanticError(`El campo ${this.identifier.lexeme} no existe dentro del ambito ${ambit}`,
        this.identifier.row, this.identifier.column));
    } else {

      const t = s.dataType;

      if (this.expression !== null) {
        const expType = this.expression.getType(symbolTable, semanticErrors, ambit);

        if (expType !== t) {
          semanticErrors.push(new SemanticError(`El tipo de dato de la expresión (${expType})
           no coincide con el tipo de dato del campo ${this.identifier.lexeme}`, this.identifier.row, this.identifier.column));
        }
      }
    }
  }

  public getTreeNode(): TreeNode {
    return new TreeNode('Asignación', [
      new TreeNode(`Variable: ${this.identifier.lexeme}`, []),
      new TreeNode('Expresión', [this.expression.getTreeNode()]),
    ]);
  }
}
