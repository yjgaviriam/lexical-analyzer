import { TreeNode } from './node';
import { Sentence } from './sentence';

/**
 * Read representation
 */
export class Read extends Sentence {

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Leer', []);
    root.children.push(new TreeNode(``, []));
    return root;
  }
}
