import { Token } from './token';

/**
 * NumericValue representation
 */
export class NumericValue {

  public sign: Token;
  public value: Token;

  constructor(sign: Token, value: Token) {
    this.sign = sign;
    this.value = value;
  }

}
