import { LogicExpression } from './logic-expression';
import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { Sentence } from './sentence';
import { SymbolTable } from './symbol-table';

/**
 * Cycle representation
 */
export class Cycle extends Sentence {

  public logicExpression: LogicExpression;
  public listSentences: Sentence[];

  constructor(logicExpression: LogicExpression, listSentences: Sentence[]) {
    super();
    this.logicExpression = logicExpression;
    this.listSentences = listSentences;
  }

  public saveSymbolTable(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {

    for (const s of this.listSentences) {
      s.saveSymbolTable(symbolTable, semanticErrors, ambit);
    }

  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {

    for (const s of this.listSentences) {
      s.analyzeSemantic(symbolTable, semanticErrors, ambit);
    }

  }

  public getTreeNode(): TreeNode {
    const sentences = new TreeNode('Sentencias', []);

    for (const sentence of this.listSentences) {
      sentences.children.push(sentence.getTreeNode());
    }

    const root = new TreeNode('Ciclo', [
      new TreeNode(`Expresión`, [this.logicExpression.getTreeNode()]),
      sentences,
    ]);

    return root;
  }
}
