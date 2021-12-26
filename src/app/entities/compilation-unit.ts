import { Declaration } from './declaration';
import { TreeNode } from './node';
import { OurFunction } from './our-function';
import { SemanticError } from './semantic-error';
import { SymbolTable } from './symbol-table';

/**
 * Unit compilation representation
 */
export class CompilationUnit {

  public listDeclarations: Declaration[];

  public listFunctions: OurFunction[];

  constructor(listDeclarations: Declaration[], listFunctions: OurFunction[]) {
    this.listDeclarations = listDeclarations;
    this.listFunctions = listFunctions;
    console.log(listFunctions);

  }

  public getTreeNode(): TreeNode[] {

    const declarations: TreeNode[] = [];

    for (const declaration of this.listDeclarations) {
      declarations.push(declaration.getTreeNode());
    }

    const functions: TreeNode[] = [];

    for (const ourFunction of this.listFunctions) {
      functions.push(ourFunction.getTreeNode());
    }

    const root = new TreeNode('Unidad de compilación', []);
    root.children.push(new TreeNode(`Declaraciones: `, declarations));
    root.children.push(new TreeNode(`Funciones: `, functions));
    return [root];
  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[]): void {

    for (const f of this.listFunctions) {
      f.analyzeSemantic(symbolTable, semanticErrors);
    }
  }

  public saveSymbolTable(symbolTable: SymbolTable, semanticErrors: SemanticError[]): void {

    for (const d of this.listDeclarations) {
      d.saveSymbolTable(symbolTable, semanticErrors, 'unidadcompilacion');
    }

    for (const f of this.listFunctions) {
      f.saveSymbolTable(symbolTable, semanticErrors, 'unidadcompilacion');
    }
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
