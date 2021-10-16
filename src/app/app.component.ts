import { Component } from '@angular/core';
import { LexicalAnalyzerService } from './services/lexical-analyzer.service';

/**
 * Root component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
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

  /**
   * Class constructor
   *
   * @param lexicalAnalyzerService Service to control logic about lexical analyzer
   */
  constructor(public lexicalAnalyzerService: LexicalAnalyzerService) {
    this.commandsExecuted = [];
    this.commandLine = '';
    this.executeCommand();
  }

  /**
   * Call function to analyze the lexema
   */
  public executeCommand(): void {

    if (this.commandLine?.length > 0) {
      this.lexicalAnalyzerService.analyze(`${this.commandLine}\n`);
      this.commandsExecuted.push(this.commandLine);
      this.commandLine = '';
    }
  }
}
