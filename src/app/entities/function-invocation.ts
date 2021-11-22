import { Argument } from './argument';
import { TreeNode } from './node';
import { Sentence } from './sentence';
import { Token } from './token';

/**
 * FunctionInvocation representation
 */
export class FunctionInvocation extends Sentence {

  public identifier: Token;
  public listArguments: Argument[];

  constructor(identifier: Token, listArguments: Argument[]) {
    super();
    this.identifier = identifier;
    this.listArguments = listArguments;
  }

  public getTreeNode(): TreeNode {

    const args = new TreeNode('Parámetros', []);

    for (const arg of this.listArguments) {
      args.children.push(arg.getTreeNode());
    }

    const root = new TreeNode('Invocación de Función', []);
    root.children.push(new TreeNode(`Función: ${this.identifier.lexeme}`, []));
    root.children.push(args);
    return root;
  }
}
