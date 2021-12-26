import { LogicExpression } from './logic-expression';
import { TreeNode } from './node';
import { SemanticError } from './semantic-error';
import { Sentence } from './sentence';
import { SymbolTable } from './symbol-table';

/**
 * Decision representation
 */
export class Decision extends Sentence {

  public logicExpression: LogicExpression;

  public listSentences: Sentence[];

  public otherListSentences: Sentence[];

  constructor(logicExpression: LogicExpression, listSentences: Sentence[], otherListSentences: Sentence[]) {
    super();
    this.logicExpression = logicExpression;
    this.listSentences = listSentences;
    this.otherListSentences = otherListSentences;
  }

  public saveSymbolTable(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {

    for (const s of this.listSentences) {
      s.saveSymbolTable(symbolTable, semanticErrors, ambit);
    }

    if (this.otherListSentences) {
      for (const s of this.otherListSentences) {
        s.saveSymbolTable(symbolTable, semanticErrors, ambit);
      }
    }

  }

  public analyzeSemantic(symbolTable: SymbolTable, semanticErrors: SemanticError[], ambit: string): void {

    for (const s of this.listSentences) {
      s.analyzeSemantic(symbolTable, semanticErrors, ambit);
    }

    if (this.otherListSentences) {
      for (const s of this.otherListSentences) {
        s.analyzeSemantic(symbolTable, semanticErrors, ambit);
      }
    }
  }

  public getTreeNode(): TreeNode {

    const sentences = new TreeNode('Sentencias', []);

    for (const sentence of this.listSentences) {
      sentences.children.push(sentence.getTreeNode());
    }

    const otherSentences = new TreeNode('Sentencias Else', []);

    if (this.otherListSentences) {
      for (const sentence of this.otherListSentences) {
        otherSentences.children.push(sentence.getTreeNode());
      }
    }

    const root = new TreeNode('Decisión', [
      new TreeNode(`Expresión`, [this.logicExpression.getTreeNode()]),
      sentences,
    ]);
    if (otherSentences.children.length > 0) { root.children.push(otherSentences); }
    return root;
  }
}
