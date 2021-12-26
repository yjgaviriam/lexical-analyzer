import { Component } from '@angular/core';
import { TreeNode } from './entities/node';
import { LexicalAnalyzerService } from './services/lexical-analyzer.service';
import { SyntacticAnalyzerService } from './services/syntactic-analyzer.service';
import { SemanticAnalyzerService } from './services/semantic-analyzer.service';

/**
 * Root component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {

  /**
   * The line where user can put text
   */
  public commandLine: string;

  /**
   * Are all commands sent to analyze
   */
  public commandsExecuted: string[];

  public treeNode: TreeNode[];

  /**
   * Class constructor
   *
   * @param lexicalAnalyzerService Service to control logic about lexical analyzer
   * @param syntacticAnalyzerService Service to control logic about syntactic analyzer
   */
  constructor(
    public lexicalAnalyzerService: LexicalAnalyzerService,
    public syntacticAnalyzerService: SyntacticAnalyzerService,
    public semanticAnalyzerService: SemanticAnalyzerService,
  ) {
    this.commandsExecuted = [];
    this.commandLine = ``;
    // remove
    this.executeCommand();
  }

  /**
   * Call function to analyze the lexeme
   */
  public executeCommand(): void {

    if (this.commandLine?.length > 0) {
      this.lexicalAnalyzerService.analyze(`${this.commandLine}\n`);
      this.commandsExecuted = [(this.commandLine)];
      this.commandLine = '';

      const compilationUnit = this.syntacticAnalyzerService.analyze(this.lexicalAnalyzerService.tokens);

      if (compilationUnit) {
        this.treeNode = compilationUnit.getTreeNode();
        this.semanticAnalyzerService.resetValues();
        this.semanticAnalyzerService.saveSymbols(compilationUnit);
        console.log(this.semanticAnalyzerService.symbolTable);

        this.semanticAnalyzerService.analyze(compilationUnit);
      } else {
        this.treeNode = [new TreeNode('Unidad de compilación', [])];
      }

    }
  }
}
