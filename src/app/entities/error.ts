import { Token } from './token';

/**
 * OurError representation
 */
export class OurError {

  public message: string;

  public token: Token;

  constructor(message: string, token: Token) {
    this.message = message;
    this.token = token;
  }

  public toString(): string {
    return `${this.message}`;
  }
}
