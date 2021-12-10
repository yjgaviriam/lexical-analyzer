import { Injectable } from '@angular/core';
import { Argument } from '../entities/argument';
import { ArithmeticExpression } from '../entities/arithmetic-expression';
import { Assignment } from '../entities/assignment';
import { CompilationUnit } from '../entities/compilation-unit';
import { Cycle } from '../entities/cycle';
import { Decision } from '../entities/decision';
import { Declaration } from '../entities/declaration';
import { Decrement } from '../entities/decrement';
import { OurError } from '../entities/error';
import { Expression } from '../entities/expression';
import { FunctionInvocation } from '../entities/function-invocation';
import { Increase } from '../entities/increase';
import { LogicExpression } from '../entities/logic-expression';
import { NumericValue } from '../entities/numeric-value';
import { OurArray } from '../entities/our-array';
import { OurFunction } from '../entities/our-function';
import { Param } from '../entities/param';
import { Print } from '../entities/print';
import { Read } from '../entities/read';
import { RelationalExpression } from '../entities/relational-expression';
import { Return } from '../entities/return';
import { Sentence } from '../entities/sentence';
import { StringExpression } from '../entities/string-expression';
import { Token } from '../entities/token';
import { Category } from '../enums/category';
import { Message } from '../enums/message';
import { ReservedWord } from '../enums/reserved-word';

@Injectable({
  providedIn: 'root',
})
export class SyntacticAnalyzerService {

  /**
   * Current position of lexeme
   */
  private currentPosition: number;

  private currentToken: Token;

  public errors: OurError[];

  private tokens: Token[];

  constructor() { }

  public analyze(tokens: Token[]): CompilationUnit {
    this.currentPosition = 0;
    this.errors = [];
    this.tokens = tokens;
    this.currentToken = this.tokens[this.currentPosition];

    return this.getCompilationUnit();
  }

  /**
   * Verify is <Parametro> ::= Identificador ":" <TipoDato>
   *
   * @returns
   */
  private getArgument(): Argument {

    if (this._currentToken().category === Category.IDENTIFIER) {
      const name = this._currentToken();
      this.getNextToken();
      return new Argument(name);

    }

    return null;
  }

  private getArray(): OurArray {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      this._currentToken().lexeme === ReservedWord.ADJUST) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const nameDeclaration = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.TWO_POINT_OPERATOR) {
          this.getNextToken();

          const dataType = this.getDataType();

          if (dataType !== null) {
            this.getNextToken();

            if (this._currentToken().category === Category.LEFT_BRACKET) {
              this.getNextToken();

              if (this._currentToken().category === Category.RIGHT_BRACKET) {
                this.getNextToken();

                if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
                  this.getNextToken();
                  return new OurArray(nameDeclaration, dataType);
                } else {
                  this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
                }
              } else {
                this.saveError(Message.NOT_FOUND_RIGHT_BRACKET);
              }
            } else {
              this.saveError(Message.NOT_FOUND_LEFT_BRACKET);
            }
          } else {
            this.saveError(Message.NOT_FOUND_DATA_TYPE);
          }
        } else {
          this.saveError(Message.NOT_FOUND_TWO_POINT_OPERATOR);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  private getAssignment(): Assignment {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.ASSIGNMENT)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.ASSIGNMENT_OPERATOR) {
          this.getNextToken();

          const expression = this.getExpression();

          if (expression) {

            if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
              this.getNextToken();
              return new Assignment(identifier, expression);
            } else {
              this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
            }
          } else {
            this.saveError(Message.NOT_FOUND_EXPRESSION);
          }
        } else {
          this.saveError(Message.NOT_FOUND_ASSIGNMENT);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  /**
   * Verify is <UnidadCompilacion> ::= StartProject [<ListDeclaraciones>?] [<ListaFunciones>] EndProject
   *
   * @returns
   */
  private getCompilationUnit(): CompilationUnit {

    if (this._currentToken().category === Category.RESERVED_WORD && this._currentToken().lexeme === ReservedWord.START_PROJECT) {
      this.getNextToken();

      const listDeclarations = this.getListDeclarations();

      const listFunctions = this.getListFunctions();

      if (listFunctions.length > 0) {
        return new CompilationUnit(listDeclarations, listFunctions);
      } else {
        this.saveError(Message.NOT_FOUND_FUNCTIONS);
      }
    }

    return null;
  }

  /**
   * Verify is cycle “(“<ExpresiónLogica>”)” <BloqueSentencias>
   *
   * @returns
   */
  private getCycle(): Cycle {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.CYCLE)) {
      this.getNextToken();

      if (this._currentToken().category === Category.LEFT_PARENTHESIS) {
        this.getNextToken();

        const logicExpression = this.getExpressionLogic();

        if (logicExpression) {
          this.getNextToken();

          if (this._currentToken().category === Category.RIGHT_PARENTHESIS) {
            this.getNextToken();

            const sentencesBlock = this.getSentencesBlock();

            if (sentencesBlock) {
              return new Cycle(logicExpression, sentencesBlock);
            } else {
              this.saveError(Message.NOT_FOUND_SENTENCES);
            }
          } else {
            this.saveError(Message.NOT_FOUND_RIGHT_PARENTHESIS);
          }
        } else {
          this.saveError(Message.NOT_FOUND_LOGIC_EXPRESSION);
        }
      } else {
        this.saveError(Message.NOT_FOUND_LEFT_PARENTHESIS);
      }
    }

    return null;
  }

  /**
   * <TipoDato> ::= boolean | char | decimal | int | string
   *
   * @returns
   */
  private getDataType(): Token {

    if (this._currentToken().category === Category.RESERVED_WORD) {

      if (this._currentToken().lexeme === ReservedWord.BOOLEAN || this._currentToken().lexeme === ReservedWord.CHAR ||
        this._currentToken().lexeme === ReservedWord.DECIMAL || this._currentToken().lexeme === ReservedWord.INT ||
        this._currentToken().lexeme === ReservedWord.STRING) {
        return this._currentToken();
      }
    }

    return null;
  }

  private getDecision(): Decision {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.WHEN)) {
      this.getNextToken();

      if (this._currentToken().category === Category.LEFT_PARENTHESIS) {
        this.getNextToken();

        const logicExpression = this.getExpressionLogic();

        if (logicExpression) {
          this.getNextToken();

          if (this._currentToken().category === Category.RIGHT_PARENTHESIS) {
            this.getNextToken();

            const sentences = this.getSentencesBlock();

            if (sentences) {

              if (this._currentToken().category === Category.RESERVED_WORD &&
                (this._currentToken().lexeme === ReservedWord.OTHER)) {
                this.getNextToken();

                const otherSentences = this.getSentencesBlock();

                if (otherSentences) {
                  return new Decision(logicExpression, sentences, otherSentences);
                } else {
                  this.saveError(Message.NOT_FOUND_SENTENCES);
                }
              } else {
                return new Decision(logicExpression, sentences, null);
              }
            } else {
              this.saveError(Message.NOT_FOUND_SENTENCES);
            }
          } else {
            this.saveError(Message.NOT_FOUND_RIGHT_PARENTHESIS);
          }
        } else {
          this.saveError(Message.NOT_FOUND_WHEN);
        }
      } else {
        this.saveError(Message.NOT_FOUND_LEFT_PARENTHESIS);
      }
    }

    return null;
  }

  /**
   * Verify is <Declaracion> ::= Mut | Inmut Identificador OperadorDosPuntos <TipoDato> OperadorFinSentencia
   *
   * @returns
   */
  private getDeclaration(): Declaration {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.MUTABLE || this._currentToken().lexeme === ReservedWord.IMMUTABLE)) {
      const type = this._currentToken();
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const nameDeclaration = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.TWO_POINT_OPERATOR) {
          this.getNextToken();

          const dataType = this.getDataType();

          if (dataType !== null) {
            this.getNextToken();

            if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
              this.getNextToken();
              return new Declaration(nameDeclaration, dataType, type);
            } else {
              this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
            }
          } else {
            this.saveError(Message.NOT_FOUND_DATA_TYPE);
          }
        } else {
          this.saveError(Message.NOT_FOUND_TWO_POINT_OPERATOR);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  private getExpression(): Expression {

    const arithmeticExpression = this.getExpressionArithmetic();

    if (arithmeticExpression) {
      return arithmeticExpression;
    }

    const logicExpression = this.getExpressionLogic();

    if (logicExpression) {
      return logicExpression;
    }

    const relationalExpression = this.getExpressionRelational();

    if (relationalExpression) {
      return relationalExpression;
    }

    const stringExpression = this.getExpressionString();

    if (stringExpression) {
      return stringExpression;
    }

    return null;
  }

  private getExpressionArithmetic(): ArithmeticExpression {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.ARIT)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.ARITHMETIC_OPERATOR) {
          const operator = this._currentToken();
          this.getNextToken();

          if (this._currentToken().category === Category.IDENTIFIER) {
            const secondIdentifier = this._currentToken();
            this.getNextToken();

            return new ArithmeticExpression(identifier, operator, secondIdentifier);
          } else {
            this.saveError(Message.NOT_FOUND_IDENTIFIER);
          }
        } else {
          this.saveError(Message.NOT_FOUND_ARITHMETIC_OPERATOR);
        }
      } else {

        const numericValue = this.getNumericValue();

        if (numericValue) {
          this.getNextToken();
          return new ArithmeticExpression(undefined, undefined, undefined, numericValue);
        } else {
          this.saveError(Message.NOT_FOUND_IDENTIFIER);
        }
      }
    }

    return null;
  }

  private getExpressionLogic(): LogicExpression {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.LOG)) {
      this.getNextToken();

      if (this._currentToken().category === Category.NEGATION_OPERATOR) {
        this.getNextToken();

        if (this._currentToken().category === Category.RESERVED_WORD &&
          (this._currentToken().lexeme === ReservedWord.FALSE || this._currentToken().lexeme === ReservedWord.TRUE)) {
          const valueOperator = this._currentToken();
          return new LogicExpression(valueOperator);
        } else {
          this.saveError(Message.NOT_FOUND_LOGIC_VALUE);
        }
      } else {

        if (this._currentToken().category === Category.RESERVED_WORD &&
          (this._currentToken().lexeme === ReservedWord.FALSE || this._currentToken().lexeme === ReservedWord.TRUE)) {
          const valueOperator = this._currentToken();
          return new LogicExpression(valueOperator);
        } else {
          this.saveError(Message.NOT_FOUND_LOGIC_VALUE);
        }
      }
    }

    return null;
  }

  private getExpressionRelational(): RelationalExpression {

    return null;
  }

  private getExpressionString(): StringExpression {

    // if (this._currentToken().category === ) {

    // }

    return null;
  }

  /**
   * Verify is <Función> ::= function Identificador "(" <ListaParametros>? ")" ":" <TipoRetorno> <BloqueSentencias>
   *
   * @returns
   */
  private getFunction(): OurFunction {

    if (this._currentToken().category === Category.RESERVED_WORD && this._currentToken().lexeme === ReservedWord.FUNCTION) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {

        const functionName = this._currentToken();

        this.getNextToken();

        if (this._currentToken().category === Category.LEFT_PARENTHESIS) {
          this.getNextToken();

          const params = this.getListParams();

          if (this._currentToken().category === Category.RIGHT_PARENTHESIS) {
            this.getNextToken();

            if (this._currentToken().category === Category.TWO_POINT_OPERATOR) {
              this.getNextToken();

              const returnType = this.getReturnType();

              if (returnType !== null) {
                this.getNextToken();

                const sentences = this.getSentencesBlock();

                if (sentences !== null) {
                  return new OurFunction(returnType, functionName, sentences, params);
                } else {
                  this.saveError(Message.NOT_FOUND_SENTENCES);
                }
              } else {
                this.saveError(Message.NOT_FOUND_RETURN);
              }
            } else {
              this.saveError(Message.NOT_FOUND_TWO_POINT_OPERATOR);
            }
          } else {
            this.saveError(Message.NOT_FOUND_RIGHT_PARENTHESIS);
          }
        } else {
          this.saveError(Message.NOT_FOUND_LEFT_PARENTHESIS);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  /**
   * Verify is <InvocacionFuncion> ::= originate <identificador> “(“<ListaArgumentos>?”)”
   *
   * @returns
   */
  private getFunctionInvocation(): FunctionInvocation {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.ORIGINATE)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.LEFT_PARENTHESIS) {
          this.getNextToken();

          const args = this.getListArguments();

          if (args.length > 0) {

            if (this._currentToken().category === Category.RIGHT_PARENTHESIS) {
              this.getNextToken();

              if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
                this.getNextToken();
                return new FunctionInvocation(identifier, args);
              } else {
                this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
              }
            } else {
              this.saveError(Message.NOT_FOUND_RIGHT_PARENTHESIS);
            }
          } else if (this._currentToken().category === Category.RIGHT_PARENTHESIS) {
            this.getNextToken();

            if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
              this.getNextToken();
              return new FunctionInvocation(identifier, args);
            } else {
              this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
            }
          } else {
            this.saveError(Message.NOT_FOUND_RIGHT_PARENTHESIS);
          }
        } else {
          this.saveError(Message.NOT_FOUND_LEFT_PARENTHESIS);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  private getListArguments(): Argument[] {

    let argument = this.getArgument();
    const listArguments: Argument[] = [];

    while (argument != null && this._currentToken().category !== Category.RIGHT_PARENTHESIS) {

      listArguments.push(argument);

      if (this._currentToken().category === Category.COMMA_OPERATOR) {
        this.getNextToken();

        argument = this.getArgument();

        if (argument === null) {
          this.saveError(Message.NOT_FOUND_NEXT_PARAM);
          break;
        }
      } else {
        this.saveError(Message.NOT_FOUND_NEXT_PARAM);
        break;
      }
    }

    return listArguments;
  }

  private getListDeclarations(): Declaration[] {

    let declaration = this.getDeclaration();
    const listDeclarations: Declaration[] = [];

    while (declaration != null) {
      listDeclarations.push(declaration);
      declaration = this.getDeclaration();
    }

    return listDeclarations;
  }

  /**
   * Verify is <ListaFunciones> ::= <Función> [<ListaFunciones>]
   *
   * @returns
   */
  private getListFunctions(): OurFunction[] {

    let ourFunction = this.getFunction();
    const listFunctions: OurFunction[] = [];

    while (ourFunction != null) {
      listFunctions.push(ourFunction);
      ourFunction = this.getFunction();
    }

    return listFunctions;
  }

  private getListParams(): Param[] {

    let param = this.getParam();
    const listParams: Param[] = [];

    while (param != null && this._currentToken().category !== Category.RIGHT_PARENTHESIS) {

      listParams.push(param);

      if (this._currentToken().category === Category.COMMA_OPERATOR) {
        this.getNextToken();
        param = this.getParam();

        if (param === null) {
          this.saveError(Message.NOT_FOUND_NEXT_PARAM);
          break;
        }
      } else {
        this.saveError(Message.NOT_FOUND_NEXT_PARAM);
        break;
      }
    }

    return listParams;
  }

  /**
   * <ListaSentencias> ::= "{" [<ListaSentencias>] "}"
   *
   * @returns
   */
  private getListSentences(): Sentence[] {

    let sentence = this.getSentence();
    const listSentences: Sentence[] = [];

    while (sentence != null) {
      listSentences.push(sentence);
      sentence = this.getSentence();
    }

    return listSentences;
  }

  private getNextToken(): void {
    this.currentPosition++;

    if (this.currentPosition < this.tokens.length) {
      this.currentToken = this.tokens[this.currentPosition];
    }
  }

  private getNumericValue(): NumericValue {

    let sign: Token = null;

    if (this._currentToken().category === Category.LESS_OPERATOR || this._currentToken().category === Category.PLUS_OPERATOR) {
      sign = this._currentToken();
      this.getNextToken();
    }
    if (this._currentToken().category === Category.INTEGER || this._currentToken().category === Category.DECIMAL ||
      this._currentToken().category === Category.IDENTIFIER) {
      const value = this._currentToken();
      return new NumericValue(sign, value);
    }

    return null;
  }

  /**
   * Verify is <Parametro> ::= Identificador ":" <TipoDato>
   *
   * @returns
   */
  private getParam(): Param {

    if (this._currentToken().category === Category.IDENTIFIER) {
      const nameParam = this._currentToken();
      this.getNextToken();

      if (this._currentToken().category === Category.TWO_POINT_OPERATOR) {
        this.getNextToken();

        const datatype = this.getDataType();

        if (datatype !== null) {
          this.getNextToken();
          return new Param(nameParam, datatype);
        } else {
          this.saveError(Message.NOT_FOUND_DATA_TYPE);
        }
      } else {
        this.saveError(Message.NOT_FOUND_TWO_POINT_OPERATOR);
      }
    }

    return null;
  }

  private getPrint(): Print {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.PRINT)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
          this.getNextToken();
          return new Print(identifier);
        } else {
          this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  /**
   * Verify is <LecturaDatos> ::= read <identificador>
   *
   * @returns
   */
  private getRead(): Read {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.READ)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
          this.getNextToken();
          return new Read(identifier);
        } else {
          this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  private getReturn(): Return {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.TURN)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
          this.getNextToken();
          return new Return(identifier);
        } else {
          this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  /**
   * <TipoRetorno> ::= boolean | char | decimal | int | string | void
   *
   * @returns
   */
  private getReturnType(): Token {

    if (this._currentToken().category === Category.RESERVED_WORD) {

      if (this._currentToken().lexeme === ReservedWord.BOOLEAN || this._currentToken().lexeme === ReservedWord.CHAR ||
        this._currentToken().lexeme === ReservedWord.DECIMAL || this._currentToken().lexeme === ReservedWord.INT ||
        this._currentToken().lexeme === ReservedWord.STRING || this._currentToken().lexeme === ReservedWord.VOID) {
        return this._currentToken();
      }
    }

    return null;
  }

  private getSentence(): Sentence {

    const array = this.getArray();

    if (array) {
      return array;
    }

    const assignment = this.getAssignment();

    if (assignment) {
      return assignment;
    }

    const cycle = this.getCycle();

    if (cycle) {
      return cycle;
    }

    const decision = this.getDecision();

    if (decision) {
      return decision;
    }

    const declaration = this.getDeclaration();

    if (declaration) {
      return declaration;
    }

    const functionInvocation = this.getFunctionInvocation();

    if (functionInvocation) {
      return functionInvocation;
    }

    const print = this.getPrint();

    if (print) {
      return print;
    }

    const read = this.getRead();

    if (read) {
      return read;
    }

    const ourReturn = this.getReturn();

    if (ourReturn) {
      return ourReturn;
    }

    const decrement = this.getDecrement();

    if (decrement) {
      return decrement;
    }

    const increase = this.getIncrease();

    if (increase) {
      return increase;
    }

    return null;
  }

  private getDecrement(): Decrement {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.DOWN)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();

        if (this._currentToken().category === Category.DECREMENT_OPERATOR) {
          this.getNextToken();
          if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
            this.getNextToken();
            return new Decrement(identifier);
          } else {
            this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
          }
        } else {
          this.saveError(Message.NOT_FOUND_DECREMENT_OPERATOR);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  private getIncrease(): Increase {

    if (this._currentToken().category === Category.RESERVED_WORD &&
      (this._currentToken().lexeme === ReservedWord.UP)) {
      this.getNextToken();

      if (this._currentToken().category === Category.IDENTIFIER) {
        const identifier = this._currentToken();
        this.getNextToken();
        if (this._currentToken().category === Category.INCREMENT_OPERATOR) {
          this.getNextToken();
          if (this._currentToken().category === Category.END_OF_SENTENCE_OPERATOR) {
            this.getNextToken();
            return new Increase(identifier);
          } else {
            this.saveError(Message.NOT_FOUND_END_LINE_OPERATOR);
          }
        } else {
          this.saveError(Message.NOT_FOUND_INCREMENT_OPERATOR);
        }
      } else {
        this.saveError(Message.NOT_FOUND_IDENTIFIER);
      }
    }

    return null;
  }

  /**
   * <BloqueSentencias> ::= "{" [<ListaSentencias>] "}"
   *
   * @returns
   */
  private getSentencesBlock(): Sentence[] {

    if (this._currentToken().category === Category.LEFT_BRACE) {
      this.getNextToken();

      const listSentences = this.getListSentences();

      if (this._currentToken().category === Category.RIGHT_BRACE) {
        this.getNextToken();
        return listSentences;
      } else {
        this.saveError(Message.NOT_FOUND_RIGHT_BRACE);
      }
    }

    return null;
  }

  private saveError(message: string): void {
    this.errors.push(new OurError(message, this._currentToken()));
  }

  private _currentToken(): Token {
    return this.currentToken;
  }
}
