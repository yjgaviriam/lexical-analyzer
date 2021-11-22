import { TreeNode } from './node';
import { Sentence } from './sentence';
import { Token } from './token';

/**
 * Read representation
 */
export class Read extends Sentence {

  public identifier: Token;

  constructor(identifier: Token) {
    super();
    this.identifier = identifier;
  }

  public getTreeNode(): TreeNode {
    return new TreeNode(`Leer: ${this.identifier.lexeme}`, []);
  }
}
