import { TreeNode } from './node';
import { Sentence } from './sentence';

/**
 * Return representation
 */
export class Return extends Sentence {

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Retorno', []);
    root.children.push(new TreeNode(``, []));
    return root;
  }
}
