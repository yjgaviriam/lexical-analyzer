import { TreeNode } from './node';
import { Sentence } from './sentence';

/**
 * FunctionInvocation representation
 */
export class FunctionInvocation extends Sentence {

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Invocación de Función', []);
    root.children.push(new TreeNode(``, []));
    return root;
  }
}
