import { ReservedWord } from '../enums/reserved-word';
import { Expression } from './expression';
import { TreeNode } from './node';
import { NumericValue } from './numeric-value';
import { Token } from './token';
import { Category } from '../enums/category';
import { SemanticError } from './semantic-error';
import { SymbolTable } from './symbol-table';

/**
 * ArithmeticExpression representation
 */
export class ArithmeticExpression extends Expression {

  public identifier: Token;
  public operator: Token;
  public secondIdentifier: Token;
  public numericValue: NumericValue;

  constructor(identifier: Token, operator: Token, secondIdentifier: Token, numericValue?: NumericValue) {
    super();
    if (!numericValue) {
      this.identifier = identifier;
      this.operator = operator;
      this.secondIdentifier = secondIdentifier;
    } else {
      this.numericValue = numericValue;
    }
  }

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Expresión Arimetica', []);

    if (!this.numericValue) {
      root.children.push(new TreeNode(`Primer identificador ${this.identifier.lexeme}`, []));
      root.children.push(new TreeNode(`Operador ${this.operator.lexeme}`, []));
      root.children.push(new TreeNode(`Segundo identificador ${this.secondIdentifier.lexeme}`, []));
    } else {
      root.children.push(new TreeNode(`Valor numerico: ${this.numericValue.sign?.lexeme || ''}${this.numericValue.value.lexeme}`, []));
    }

    return root;
  }

  public getType(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): string {
    if (this.numericValue) {
      if (this.numericValue.value.category === Category.DECIMAL) {
        return ReservedWord.DECIMAL;
      } else {
        return ReservedWord.INT;
      }
    } else {

      const s1 = symbolTable.searchSymbolValue(this.identifier.lexeme, ambit);
      const s2 = symbolTable.searchSymbolValue(this.secondIdentifier.lexeme, ambit);

      if (s1 === null) {
        semanticErrors.push(new SemanticError(`El campo ${this.identifier.lexeme} no existe dentro del ambito ${ambit}`,
          this.identifier.row, this.identifier.column));
      }

      if (s2 === null) {
        semanticErrors.push(new SemanticError(`El campo ${this.secondIdentifier.lexeme} no existe dentro del ambito ${ambit}`,
          this.identifier.row, this.identifier.column));
      }

      if (s1 !== null && s2 !== null) {
        if (this.identifier.category === Category.DECIMAL || this.secondIdentifier.category === Category.DECIMAL) {
          return ReservedWord.DECIMAL;
        } else {
          return ReservedWord.INT;
        }
      }

      return null;
    }
  }
}
