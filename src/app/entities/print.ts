import { TreeNode } from './node';
import { Sentence } from './sentence';
import { Token } from './token';

/**
 * Print representation
 */
export class Print extends Sentence {

  public identifier: Token;

  constructor(identifier: Token) {
    super();
    this.identifier = identifier;
  }

  public getTreeNode(): TreeNode {
    return new TreeNode(`Imprimir: ${this.identifier.lexeme}`, []);
  }
}
