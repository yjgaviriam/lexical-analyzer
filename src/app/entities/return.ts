import { TreeNode } from './node';
import { Sentence } from './sentence';
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
}
