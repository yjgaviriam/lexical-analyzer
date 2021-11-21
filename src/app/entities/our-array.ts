import { TreeNode } from './node';
import { Sentence } from './sentence';
import { Token } from './token';

/**
 * Representation of our array
 */
export class OurArray extends Sentence {

  public nameIdentifier: Token;
  public dataType: Token;

  constructor(nameIdentifier: Token, dataType: Token) {
    super();
    this.nameIdentifier = nameIdentifier;
    this.dataType = dataType;
  }

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Arreglo', [
      new TreeNode(`${this.nameIdentifier.lexeme}: ${this.dataType.lexeme}`, []),
    ]);
    return root;
  }
}
