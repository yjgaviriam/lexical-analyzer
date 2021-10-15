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
    this.commandLine = '`5` `Esta miercoles es una cadena ` ¿ 3 ? 5 z ?~ a ¿~ 8 jdhaskdha 2 ° 3 °°°~ 4 !!! b ¡~2 ¡ c !~34 ¡ 22.3 \n' +
      '3<2 as3 33s sasasasasasa ~ 3<~ asdasd >~ 989> 556.6 ÿÖ dsfÖ 66 88¡¡ asdsa~~88 33!! 222.33¬~55 \n private public return' +
      'sisi■ #/ Esto es un comentario de linea \naqui sigue texto #* Esto es un comentario\nDe bloque *# break continue' +
      '555 `Cadena`, `\\n` `o` Caracter `Cadena fallida';
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
