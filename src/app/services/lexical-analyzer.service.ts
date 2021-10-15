import { Injectable } from '@angular/core';
import { Token } from '../entities/token';
import { Category } from '../enums/category';
import { RegularExpressionsService } from './regular-expressions.service';

/**
 * Service to control logic about lexical analyzer
 */
@Injectable({
  providedIn: 'root',
})
export class LexicalAnalyzerService {

  /**
   * Max characters for a identifier
   */
  public static MAX_CHARACTER_IDENTIFIERS = 10;

  /**
   * Current char
   */
  private currentCharacter: string;

  /**
   * Current column of lexeme
   */
  private currentColumn: number;

  /**
   * Current position of lexeme
   */
  private currentPosition: number;

  /**
   * Current row of lexeme
   */
  private currentRow: number;

  /**
   * List of tokens that make up the source code
   */
  public tokens: Token[];

  /**
   * The source code to analyze
   */
  public sourceCode: string;

  /**
   * Class constructor
   *
   * @param regularExpressionsService Service to analyze string with regular expressions
   */
  constructor(private regularExpressionsService: RegularExpressionsService) { }

  /**
   * Analyze and classify the source code to tokens
   *
   * @param sourceCode The source code to analyze
   */
  public analyze(sourceCode: string): void {

    this.sourceCode = sourceCode;
    this.currentPosition = 0;
    this.currentCharacter = this.sourceCode[this.currentPosition];
    this.tokens = [];
    this.currentRow = 0;
    this.currentColumn = 0;

    while (this.currentCharacter !== undefined) {

      if (this.currentCharacter === ' ' || this.currentCharacter === '\t' || this.currentCharacter === '\n') {
        this.getNextCharacter();
        continue;
      }

      if (this.isInteger()) { continue; }

      if (this.isDecimal()) { continue; }

      if (this.isIdentifier()) { continue; }

      if (this.isAssignmentOperator()) { continue; }

      if (this.isLogicOperator()) { continue; }

      if (this.isIncrementOperator()) { continue; }

      if (this.isDecrementOperator()) { continue; }

      if (this.isMinorOperator()) { continue; }

      if (this.isMinorOrEqualOperator()) { continue; }

      if (this.isMajorOperator()) { continue; }

      if (this.isMajorOrEqualOperator()) { continue; }

      if (this.isEqualsOperator()) { continue; }

      if (this.isDifferentOperator()) { continue; }

      if (this.isSumOperator()) { continue; }

      if (this.isSumAssignmentOperator()) { continue; }

      if (this.isSubtraction()) { continue; }

      if (this.isSubtractionAssignmentOperator()) { continue; }

      if (this.isModuloOperator()) { continue; }

      if (this.isModuloOperatorAssignmentOperator()) { continue; }

      if (this.isMultiplicationOperator()) { continue; }

      if (this.isMultiplicationAssignmentOperator()) { continue; }

      if (this.isDivisionOperator()) { continue; }

      if (this.isDivisionAssignmentOperator()) { continue; }

      if (this.isEndOfSentenceOperator()) { continue; }

      if (this.isLineComment()) { continue; }

      if (this.isBlockComment()) { continue; }

      if (this.isCharacter()) { continue; }

      if (this.isString()) { continue; }

      this.saveToken(this.currentCharacter, Category.UNKNOWN, this.currentRow, this.currentColumn);
      this.getNextCharacter();
    }
  }

  /**
   * Advance to the next character in the source code
   */
  private getNextCharacter(): void {

    if (this.currentCharacter === '\n') {
      this.currentRow++;
      this.currentColumn = 0;
    } else {
      this.currentColumn++;
    }

    this.currentPosition++;
    this.currentCharacter = this.sourceCode[this.currentPosition];
  }

  private isAssignmentOperator(): boolean {

    if (this.currentCharacter === '~') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.ASSIGNMENT_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isBlockComment(): boolean {

    if (this.currentCharacter === '#') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '*') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        while (this.currentCharacter?.charAt(0) !== '*' && this.whatIsTheNextCharacter() !== '#') {
          try {
            if (this.currentCharacter === undefined) {
              throw new RangeError();
            }
            lexeme += this.currentCharacter;
            this.getNextCharacter();
          } catch (exception) {
            if (exception instanceof RangeError) {
              this.saveToken(lexeme, Category.UNKNOWN, initialRow, initialColumn);
              return true;
            } else {
              alert('Error desconocido al leer comentario de bloque');
            }
          }
        }

        lexeme += this.currentCharacter;
        this.getNextCharacter();

        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.BLOCK_COMMENT, initialRow, initialColumn);
        return true;
      } else if (this.currentCharacter?.charAt(0) === '/') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isCharacter(): boolean {

    if (this.currentCharacter === '`') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '\\') {

        lexeme += this.currentCharacter;
        this.getNextCharacter();

        if ((this.currentCharacter?.charAt(0) === 't' || this.currentCharacter?.charAt(0) === '\\' ||
          this.currentCharacter?.charAt(0) === 'n') && this.whatIsTheNextCharacter() === '`') {
          lexeme += this.currentCharacter;
          this.getNextCharacter();

          lexeme += this.currentCharacter;
          this.getNextCharacter();

          this.saveToken(lexeme, Category.CHARACTER, initialRow, initialColumn);
          return true;
        } else {
          this.restartReading(initialPosition, initialRow, initialColumn);
          return false;
        }
      } else if (this.whatIsTheNextCharacter() === '`') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.CHARACTER, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isDecimal(): boolean {

    if (this.currentCharacter === '.' || this.regularExpressionsService.isDigit(this.currentCharacter)) {
      let lexeme = '';
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      if (this.currentCharacter === '.') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        if (this.regularExpressionsService.isDigit(this.currentCharacter)) {
          lexeme += this.currentCharacter;
          this.getNextCharacter();
        }
      } else {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        while (this.regularExpressionsService.isDigit(this.currentCharacter)) {
          lexeme += this.currentCharacter;
          this.getNextCharacter();
        }

        if (this.currentCharacter === '.') {
          lexeme += this.currentCharacter;
          this.getNextCharacter();

          if (!this.regularExpressionsService.isDigit(this.currentCharacter)) {
            this.restartReading(initialPosition, initialRow, initialColumn);
            return false;
          }
        }
      }

      while (this.regularExpressionsService.isDigit(this.currentCharacter)) {
        lexeme += this.currentCharacter;
        this.getNextCharacter();
      }

      this.saveToken(lexeme, Category.DECIMAL, initialRow, initialColumn);
      return true;
    }

    return false;
  }

  private isDecrementOperator(): boolean {

    if (this.currentCharacter === '!') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter === '!') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.DECREMENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isDifferentOperator(): boolean {

    if (this.currentCharacter === '¬') {
      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.DIFFERENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isDivisionOperator(): boolean {

    if (this.currentCharacter === '¿') {
      const lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        this.saveToken(lexeme, Category.DIVISION_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isDivisionAssignmentOperator(): boolean {

    if (this.currentCharacter === '¿') {
      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.DIVISION_ASSIGNMENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isEndOfSentenceOperator(): boolean {

    if (this.currentCharacter === '■') {
      this.saveToken(this.currentCharacter, Category.END_OF_SENTENCE_OPERATOR, this.currentRow, this.currentColumn);
      this.getNextCharacter();
      return true;
    }

    return false;
  }

  private isEqualsOperator(): boolean {

    if (this.currentCharacter === '~') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.EQUALS_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }

    }

    return false;
  }

  private isIdentifier(): boolean {

    if (this.regularExpressionsService.isLetter(this.currentCharacter)) {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      while (this.regularExpressionsService.isLetter(this.currentCharacter) ||
        this.regularExpressionsService.isDigit(this.currentCharacter)) {

        lexeme += this.currentCharacter;
        this.getNextCharacter();

        if (lexeme.length > LexicalAnalyzerService.MAX_CHARACTER_IDENTIFIERS) {
          this.restartReading(initialPosition, initialRow, initialColumn);
          return false;
        }

      }

      this.saveToken(lexeme, Category.IDENTIFIER, initialRow, initialColumn);
      return true;
    }

    return false;
  }

  private isIncrementOperator(): boolean {

    if (this.currentCharacter === '¡') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter === '¡') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.INCREMENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isInteger(): boolean {

    if (this.regularExpressionsService.isDigit(this.currentCharacter)) {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      while (this.regularExpressionsService.isDigit(this.currentCharacter)) {
        lexeme += this.currentCharacter;
        this.getNextCharacter();
      }

      if (this.currentCharacter === '.') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }

      this.saveToken(lexeme, Category.INTEGER, initialRow, initialColumn);
      return true;
    }

    return false;
  }

  private isLineComment(): boolean {

    if (this.currentCharacter === '#') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '/') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        while (this.currentCharacter?.charAt(0) !== '\n') {
          lexeme += this.currentCharacter;
          this.getNextCharacter();
        }

        this.saveToken(lexeme, Category.LINE_COMMENT, initialRow, initialColumn);
        return true;
      } else if (this.currentCharacter?.charAt(0) === '*') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isLogicOperator(): boolean {

    if (this.currentCharacter === 'ÿ' || this.currentCharacter === 'Ö') {
      this.saveToken(this.currentCharacter, Category.LOGIC_OPERATOR, this.currentRow, this.currentColumn);
      this.getNextCharacter();
      return true;
    }

    return false;
  }

  private isMinorOperator(): boolean {

    if (this.currentCharacter === '<') {

      const lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        this.saveToken(lexeme, Category.MINOR_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isMinorOrEqualOperator(): boolean {

    if (this.currentCharacter === '<') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.MINOR_OR_EQUAL_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isMajorOperator(): boolean {

    if (this.currentCharacter === '>') {

      const lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        this.saveToken(lexeme, Category.MAJOR_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isMajorOrEqualOperator(): boolean {

    if (this.currentCharacter === '>') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.MAJOR_OR_EQUAL_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isModuloOperator(): boolean {

    if (this.currentCharacter === '?') {
      const lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        this.saveToken(lexeme, Category.MODULO_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isModuloOperatorAssignmentOperator(): boolean {

    if (this.currentCharacter === '?') {
      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.MODULO_ASSIGNMENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isMultiplicationOperator(): boolean {

    if (this.currentCharacter === '°') {
      const lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        this.saveToken(lexeme, Category.MULTIPLICATION_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isMultiplicationAssignmentOperator(): boolean {

    if (this.currentCharacter === '°') {
      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.MULTIPLICATION_ASSIGNMENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isReservedWord(): boolean {



    return false;
  }

  private isString(): boolean {

    if (this.currentCharacter === '`') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '\\') {

        lexeme += this.currentCharacter;
        this.getNextCharacter();

        if ((this.currentCharacter?.charAt(0) === 't' || this.currentCharacter?.charAt(0) === '\\' ||
          this.currentCharacter?.charAt(0) === 'n') && this.whatIsTheNextCharacter() === '`') {
          this.restartReading(initialPosition, initialRow, initialColumn);
          return false;
        } else {
          while (this.currentCharacter !== '`') {
            try {
              if (this.currentCharacter === undefined) {
                throw new RangeError();
              }
              lexeme += this.currentCharacter;
              this.getNextCharacter();
            } catch (exception) {
              if (exception instanceof RangeError) {
                this.saveToken(lexeme, Category.UNKNOWN, initialRow, initialColumn);
                return true;
              } else {
                alert('Error desconocido al leer comentario de bloque');
              }
            }
          }

          lexeme += this.currentCharacter;
          this.getNextCharacter();

          this.saveToken(lexeme, Category.STRING, initialRow, initialColumn);
          return true;
        }
      } else if (this.whatIsTheNextCharacter() === '`') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        while (this.currentCharacter !== '`') {
          try {
            if (this.currentCharacter === undefined) {
              throw new RangeError();
            }
            lexeme += this.currentCharacter;
            this.getNextCharacter();
          } catch (exception) {
            if (exception instanceof RangeError) {
              this.saveToken(lexeme, Category.UNKNOWN, initialRow, initialColumn);
              return true;
            } else {
              alert('Error desconocido al leer comentario de bloque');
            }
          }
        }

        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.STRING, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isSubtraction(): boolean {

    if (this.currentCharacter === '!') {

      const lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter === '!' || this.currentCharacter === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        this.saveToken(lexeme, Category.SUBTRACTION_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isSubtractionAssignmentOperator(): boolean {
    if (this.currentCharacter === '!') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.SUBTRACTION_ASSIGNMENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  private isSumOperator(): boolean {
    if (this.currentCharacter === '¡') {

      const lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter === '¡' || this.currentCharacter === '~') {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      } else {
        this.saveToken(lexeme, Category.SUM_OPERATOR, initialRow, initialColumn);
        return true;
      }
    }

    return false;
  }

  private isSumAssignmentOperator(): boolean {
    if (this.currentCharacter === '¡') {

      let lexeme = this.currentCharacter;
      const initialRow = this.currentRow;
      const initialColumn = this.currentColumn;
      const initialPosition = this.currentPosition;

      this.getNextCharacter();

      if (this.currentCharacter?.charAt(0) === '~') {
        lexeme += this.currentCharacter;
        this.getNextCharacter();

        this.saveToken(lexeme, Category.SUM_ASSIGNMENT_OPERATOR, initialRow, initialColumn);
        return true;
      } else {
        this.restartReading(initialPosition, initialRow, initialColumn);
        return false;
      }
    }

    return false;
  }

  /**
   * Makes backtracking, restarting the global variables
   *
   * @param position The position to restart
   * @param row The row to restart
   * @param column The column to restart
   */
  private restartReading(position: number, row: number, column: number): void {
    this.currentPosition = position;
    this.currentRow = row;
    this.currentColumn = column;
    this.currentCharacter = this.sourceCode[this.currentPosition];
  }

  /**
   * Save the token
   *
   * @param lexeme Word to save
   * @param category Category of token
   * @param row Row where the word is
   * @param column Column where the word start
   */
  private saveToken(lexeme: string, category: Category, row: number, column: number): void {
    this.tokens.push(new Token(lexeme, category, row, column));
  }

  /**
   * Get the next character
   *
   * @returns The character
   */
  private whatIsTheNextCharacter(): string {
    return this.sourceCode[this.currentPosition + 1];
  }

}
