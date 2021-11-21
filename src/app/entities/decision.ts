import { LogicExpression } from './logic-expression';
import { TreeNode } from './node';
import { Sentence } from './sentence';

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

    const root = new TreeNode('Decisión', []);
    root.children.push(new TreeNode(`Expresión : ${this.logicExpression}`, []));
    root.children.push(sentences);
    root.children.push(otherSentences);
    return root;
  }
}
