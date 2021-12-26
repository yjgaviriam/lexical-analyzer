import { ReservedWord } from '../enums/reserved-word';
import { Expression } from './expression';

/**
 * RelationalExpression representation
 */
export class RelationalExpression extends Expression {

  public getType(): string {
    return ReservedWord.BOOLEAN;
}
}
