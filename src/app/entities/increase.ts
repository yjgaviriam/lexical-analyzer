import { TreeNode } from './node';
import { Sentence } from './sentence';
import { Token } from './token';

/**
 * Increase representation
 */
export class Increase extends Sentence {

  public identifier: Token;

  constructor(identifier: Token) {
    super();
    this.identifier = identifier;
  }

  public getTreeNode(): TreeNode {
    return new TreeNode(`Incremento: ${this.identifier.lexeme}`, []);
  }
}
