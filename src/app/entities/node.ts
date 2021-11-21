/**
 * TreeNode representation
 */
export class TreeNode {

  public name: string;

  public children: TreeNode[];

  constructor(name: string, children: TreeNode[]) {
    this.name = name;
    this.children = children;
  }
}
