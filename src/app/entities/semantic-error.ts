export class SemanticError {

  public message: string;
  public row: number;
  public column: number;

  constructor(message: string, row: number, column: number) {
    this.message = message;
    this.row = row;
    this.column = column;
  }

  public toString(): string {
    return `${this.message}`;
  }
}
