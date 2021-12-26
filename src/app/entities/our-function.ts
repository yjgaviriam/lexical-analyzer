import { Param } from '../entities/param';
import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { Sentence } from './sentence';
import { SymbolTable } from './symbol-table';
import { Token } from './token';

/**
 * Function representation
 */
export class OurFunction {

  public typeReturn: Token;
  public functionName: Token;
  public listSentences: Sentence[];
  public listParams: Param[];

  /**
   *
   * @param typeReturn
   * @param functionName
   * @param listSentences
   * @param listParams
   */
  constructor(typeReturn: Token, functionName: Token, listSentences: Sentence[], listParams: Param[]) {
    this.typeReturn = typeReturn;
    this.functionName = functionName;
    this.listSentences = listSentences;
    this.listParams = listParams;
  }

  public getTreeNode(): TreeNode {

    const params = new TreeNode('Argumentos', []);

    for (const param of this.listParams) {
      params.children.push(param.getTreeNode());
    }

    const sentences = new TreeNode('Sentencias', []);

    for (const sentence of this.listSentences) {
      sentences.children.push(sentence.getTreeNode());
    }

    const root = new TreeNode('Función', []);
    root.children.push(new TreeNode(`Nombre: ${this.functionName.lexeme}`, []));
    root.children.push(params);
    root.children.push(new TreeNode(`Tipo Retorno: ${this.typeReturn.lexeme}`, []));
    root.children.push(sentences);

    return root;
  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[]): void {

    for (const s of this.listSentences) {
      s.analyzeSemantic(symbolTable, semanticErrors, this.functionName.lexeme);
    }
  }

  public saveSymbolTable(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {
    symbolTable.saveSymbolFunction(this.functionName.lexeme, this.typeReturn.lexeme, ambit, this.functionName.row,
      this.functionName.column, this.listParams.map((p: Param) => p.dataType.lexeme));

    for (const p of this.listParams) {
      symbolTable.saveSymbolValue(p.identifier.lexeme, p.dataType.lexeme, this.functionName.lexeme + ' ' + this.functionName.column,
        p.identifier.row, p.identifier.column, true);
    }

    for (const s of this.listSentences) {
      s.saveSymbolTable(symbolTable, semanticErrors, this.functionName.lexeme + ' ' + this.functionName.column);
    }
  }

  public toString(): string {
    return `Función (${this.typeReturn}, ${this.functionName}, ${this.listSentences}, ${this.listParams})`;
  }
}
