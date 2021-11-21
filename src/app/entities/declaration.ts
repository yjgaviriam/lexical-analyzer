import { TreeNode } from './node';
import { Token } from './token';

/**
 * Declaration representation
 */
export class Declaration {

  public dataType: Token;
  public nameVariable: Token;
  public type: Token;

  constructor(nameVariable: Token, dataType: Token, type: Token) {
    this.nameVariable = nameVariable;
    this.dataType = dataType;
    this.type = type;
  }

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Declaración', []);
    root.children.push(new TreeNode(`${this.type.lexeme} ${this.nameVariable.lexeme} :  ${this.dataType.lexeme}`, []));
    return root;
  }
}
