import { Component } from '@angular/core';
import { TreeNode } from './entities/node';
import { LexicalAnalyzerService } from './services/lexical-analyzer.service';
import { SyntacticAnalyzerService } from './services/syntactic-analyzer.service';

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
  constructor(public lexicalAnalyzerService: LexicalAnalyzerService, public syntacticAnalyzerService: SyntacticAnalyzerService) {
    this.commandsExecuted = [];
    this.commandLine = `
      StrProject
        Mut firstVaræ string■
        InMut secondVaræ decimal■
        InMut thirdVaræ boolean■
        InMut nextVaræ int■
        InMut otherVaræ char■
        function myFunction(firstParamæ string§ otherParamæ string)æ void {
          Mut secondVaræ decimal■
          adjust miArregloæ string[]■
          assignment asignar ~ arit +45■
        }
        function prFunction()æ string {
          Mut secondVaræ decimal■
        }
      EndProject
    `;
    // remove
    this.executeCommand();
  }

  /**
   * Call function to analyze the lexeme
   */
  public executeCommand(): void {

    if (this.commandLine?.length > 0) {
      this.lexicalAnalyzerService.analyze(`${this.commandLine}\n`);
      this.commandsExecuted.push(this.commandLine);
      this.commandLine = '';

      this.treeNode = this.syntacticAnalyzerService.analyze(this.lexicalAnalyzerService.tokens)?.getTreeNode() ?? [];

      console.log(this.treeNode, this.syntacticAnalyzerService.errors);

    }
  }
}
