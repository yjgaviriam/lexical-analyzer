import { TreeNode } from './node';
import { Sentence } from './sentence';

/**
 * Print representation
 */
export class Print extends Sentence {

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Imprimir', []);
    root.children.push(new TreeNode(``, []));
    return root;
  }
}
