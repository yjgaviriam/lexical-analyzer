import { Expression } from './expression';
import { TreeNode } from './node';
import { Sentence } from './sentence';
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

  public getTreeNode(): TreeNode {
    return new TreeNode('Asignación', [
      new TreeNode(`Variable: ${this.identifier.lexeme}`, []),
      new TreeNode('Expresión', [this.expression.getTreeNode()]),
    ]);
  }
}
