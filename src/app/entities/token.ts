import { Category } from '../enums/category';

/**
 * Representation of a token on the language
 */
export class Token {

  /**
   * Type of token
   */
  public category: Category;

  /**
   * Position where start the lexeme
   */
  public column: number;

  /**
   * The word
   */
  public lexeme: string;

  /**
   * Row where is located the lexeme
   */
  public row: number;

  /**
   * Class construct
   *
   * @param lexeme The word
   * @param category Type of token
   * @param row Row where is located the lexeme
   * @param column Position where start the lexeme
   */
  constructor(lexeme: string, category: Category, row: number, column: number) {
    this.category = category;
    this.column = column;
    this.lexeme = lexeme;
    this.row = row;
  }

  /**
   * Concatenate the attributes of token
   *
   * @returns The data concatenate
   */
  public toString(): string {
    return `Token(lexema=${this.lexeme}, categoría=${this.category}, fila=${this.row}, columna=${this.column})`;
  }
}
