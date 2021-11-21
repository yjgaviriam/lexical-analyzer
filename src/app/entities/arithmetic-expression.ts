import { Expression } from './expression';
import { TreeNode } from './node';
import { NumericValue } from './numeric-value';
import { Token } from './token';

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
      root.children.push(new TreeNode(`Primer identificador ${this.identifier}`, []));
      root.children.push(new TreeNode(`Operador ${this.operator}`, []));
      root.children.push(new TreeNode(`Segundo identificador ${this.secondIdentifier}`, []));
    } else {
      root.children.push(new TreeNode(`Valor numerico: ${this.numericValue.sign?.lexeme || ''}${this.numericValue.value.lexeme}`, []));
    }

    return root;
  }
}
