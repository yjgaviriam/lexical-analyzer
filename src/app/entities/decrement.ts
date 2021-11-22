import { TreeNode } from './node';
import { Sentence } from './sentence';
import { Token } from './token';

/**
 * Decrement representation
 */
export class Decrement extends Sentence {

  public identifier: Token;

  constructor(identifier: Token) {
    super();
    this.identifier = identifier;
  }

  public getTreeNode(): TreeNode {
    return new TreeNode(`Decremento: ${this.identifier.lexeme}`, []);
  }
}
