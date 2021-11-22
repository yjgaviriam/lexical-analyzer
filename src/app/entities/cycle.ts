import { LogicExpression } from './logic-expression';
import { TreeNode } from './node';
import { Sentence } from './sentence';

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
