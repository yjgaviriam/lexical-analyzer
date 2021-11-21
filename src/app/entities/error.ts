/**
 * OurError representation
 */
export class OurError {

  public message: string;

  constructor(message: string) {
    this.message = message;
  }

  public toString(): string {
    return `${this.message}`;
  }
}
