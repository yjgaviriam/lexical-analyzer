import { TreeNode } from './node';
import { Token } from './token';

/**
 * Argument representation
 */
export class Argument {

  public identifier: Token;

  constructor(identifier: Token) {
    this.identifier = identifier;
  }

  public getTreeNode(): TreeNode {
    return new TreeNode(`${this.identifier.lexeme}`, []);
  }

  public toString(): string {
    return `Parámetro (${this.identifier})`;
  }
}
