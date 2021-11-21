import { TreeNode } from './node';
import { Token } from './token';
/**
 * Param representation
 */
export class Param {

  public identifier: Token;
  public dataType: Token;

  constructor(identifier: Token, dataType: Token) {
    this.identifier = identifier;
    this.dataType = dataType;
  }

  public getTreeNode(): TreeNode {
    return new TreeNode(`${this.identifier.lexeme} : ${this.dataType.lexeme}`, []);
  }

  public toString(): string {
    return `Parámetro (${this.identifier}: ${this.dataType})`;
  }
}
