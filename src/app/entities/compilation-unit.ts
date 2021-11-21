import { Declaration } from './declaration';
import { TreeNode } from './node';
import { OurFunction } from './our-function';

/**
 * Unit compilation representation
 */
export class CompilationUnit {

  public listDeclarations: Declaration[];

  public listFunctions: OurFunction[];

  constructor(listDeclarations: Declaration[], listFunctions: OurFunction[]) {
    this.listDeclarations = listDeclarations;
    this.listFunctions = listFunctions;
  }

  public getTreeNode(): TreeNode[] {

    const functions: TreeNode[] = [];

    for (const ourFunction of this.listFunctions) {
      functions.push(ourFunction.getTreeNode());
    }

    return [new TreeNode('Unidad de compilación', functions)];
  }

  /**
   * Concatenate the attributes of token
   *
   * @returns The data concatenate
   */
  public toString(): string {
    return `Unidad de compilación { ${this.listDeclarations} ${this.listFunctions} }`;
  }
}
