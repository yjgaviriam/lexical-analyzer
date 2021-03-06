import { ReservedWord } from '../enums/reserved-word';
import { Expression } from './expression';
import { TreeNode } from './node';
import { Token } from './token';

/**
 * LogicExpression representation
 */
export class LogicExpression extends Expression {

  public valueOperator: Token;

  constructor(valueOperator: Token) {
    super();
    this.valueOperator = valueOperator;
  }

  public getTreeNode(): TreeNode {
    const root = new TreeNode(`Expresión Lógica: ${this.valueOperator.lexeme}`, []);
    return root;
  }

  public getType(): string {
      return ReservedWord.BOOLEAN;
  }
}
