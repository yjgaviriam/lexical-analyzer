import { TreeNode } from './node';
import { Param } from './param';
import { Sentence } from './sentence';
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

    const params = new TreeNode('Parámetros', []);

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

  public toString(): string {
    return `Función (${this.typeReturn}, ${this.functionName}, ${this.listSentences}, ${this.listParams})`;
  }
}
