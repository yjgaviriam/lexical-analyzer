import { TreeNode } from './node';
import { Sentence } from './sentence';

/**
 * Assignment representation
 */
export class Assignment extends Sentence {


  public getTreeNode(): TreeNode {
    const root = new TreeNode('Asignación', []);
    root.children.push(new TreeNode(``, []));
    return root;
  }
}
