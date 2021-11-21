import { TreeNode } from './node';

/**
 * Sentence representation
 */
export class Sentence {

  constructor() { }

  public getTreeNode(): TreeNode {
    return new TreeNode('Sentencia', []);
  }
}
