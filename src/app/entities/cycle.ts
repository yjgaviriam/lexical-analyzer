import { TreeNode } from './node';
import { Sentence } from './sentence';

/**
 * Cycle representation
 */
export class Cycle extends Sentence {

  public getTreeNode(): TreeNode {
    const root = new TreeNode('Ciclo', []);
    root.children.push(new TreeNode(``, []));
    return root;
  }
}
