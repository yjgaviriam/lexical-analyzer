import { Injectable } from '@angular/core';
import { ArithmeticExpression } from '../entities/arithmetic-expression';
import { Assignment } from '../entities/assignment';
import { CompilationUnit } from '../entities/compilation-unit';
import { Cycle } from '../entities/cycle';
import { Decision } from '../entities/decision';
import { Declaration } from '../entities/declaration';
import { OurError } from '../entities/error';
import { Expression } from '../entities/expression';
import { FunctionInvocation } from '../entities/function-invocation';
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
import { LexicalAnalyzerService } from './lexical-analyzer.service';

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

  constructor(private lexicalAnalyzerService: LexicalAnalyzerService) { }

  public analyze(tokens: Token[]): CompilationUnit {
    this.currentPosition = 0;
    this.errors = [];
    this.tokens = tokens;
    this.currentToken = this.tokens[this.currentPosition];

    return this.getCompilationUnit();
  }

  private getArray(): OurArray {

    if (this.currentToken.category === Category.RESERVED_WORD &&
      this.currentToken.lexeme === ReservedWord.ADJUST) {
      this.getNextToken();

      if (this.currentToken.category === Category.IDENTIFIER) {
        const nameDeclaration = this.currentToken;
        this.getNextToken();

        if (this.currentToken.category === Category.TWO_POINT_OPERATOR) {
          this.getNextToken();

          console.log(this.currentToken);

          const dataType = this.getDataType();

          if (dataType !== null) {
            this.getNextToken();

            if (this.currentToken.category === Category.LEFT_BRACKET) {
              this.getNextToken();

              if (this.currentToken.category === Category.RIGHT_BRACKET) {
                this.getNextToken();

                if (this.currentToken.category === Category.END_OF_SENTENCE_OPERATOR) {
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

    if (this.currentToken.category === Category.RESERVED_WORD &&
      (this.currentToken.lexeme === ReservedWord.ASSIGNMENT)) {
      this.getNextToken();

      if (this.currentToken.category === Category.IDENTIFIER) {
        const identifier = this.currentToken;
        this.getNextToken();

        if (this.currentToken.category === Category.ASSIGNMENT_OPERATOR) {
          this.getNextToken();

          const expression = this.getExpression();

          if (expression) {
            this.getNextToken();
            return new Assignment(identifier, expression);
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

    if (this.currentToken.category === Category.RESERVED_WORD && this.currentToken.lexeme === ReservedWord.START_PROJECT) {
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

  private getCycle(): Cycle {

    return null;
  }

  /**
   * <TipoDato> ::= boolean | char | decimal | int | string
   *
   * @returns
   */
  private getDataType(): Token {

    if (this.currentToken.category === Category.RESERVED_WORD) {

      if (this.currentToken.lexeme === ReservedWord.BOOLEAN || this.currentToken.lexeme === ReservedWord.CHAR ||
        this.currentToken.lexeme === ReservedWord.DECIMAL || this.currentToken.lexeme === ReservedWord.INT ||
        this.currentToken.lexeme === ReservedWord.STRING) {
        return this.currentToken;
      }
    }

    return null;
  }

  private getDecision(): Decision {

    if (this.currentToken.category === Category.RESERVED_WORD &&
      (this.currentToken.lexeme === ReservedWord.WHEN)) {
      this.getNextToken();

      if (this.currentToken.category === Category.LEFT_PARENTHESIS) {
        this.getNextToken();

        const logicExpression = this.getExpressionLogic();

        if (logicExpression) {
          this.getNextToken();

          if (this.currentToken.category === Category.RIGHT_PARENTHESIS) {
            this.getNextToken();

            const sentences = this.getSentencesBlock();

            if (sentences) {
              this.getNextToken();

              if (this.currentToken.category === Category.RESERVED_WORD &&
                (this.currentToken.lexeme === ReservedWord.OTHER)) {
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

    if (this.currentToken.category === Category.RESERVED_WORD &&
      (this.currentToken.lexeme === ReservedWord.MUTABLE || this.currentToken.lexeme === ReservedWord.IMMUTABLE)) {
      const type = this.currentToken;
      this.getNextToken();

      if (this.currentToken.category === Category.IDENTIFIER) {
        const nameDeclaration = this.currentToken;
        this.getNextToken();

        if (this.currentToken.category === Category.TWO_POINT_OPERATOR) {
          this.getNextToken();

          const dataType = this.getDataType();

          if (dataType !== null) {
            this.getNextToken();

            if (this.currentToken.category === Category.END_OF_SENTENCE_OPERATOR) {
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

    if (this.currentToken.category === Category.RESERVED_WORD &&
      (this.currentToken.lexeme === ReservedWord.ARIT)) {
      this.getNextToken();

      console.log('curren', this.currentToken);

      if (this.currentToken.category === Category.IDENTIFIER) {
        const identifier = this.currentToken;
        console.log('identifier', identifier);

        this.getNextToken();

        if (this.currentToken.category === Category.ARITHMETIC_OPERATOR) {
          const operator = this.currentToken;
          this.getNextToken();

          if (this.currentToken.category === Category.IDENTIFIER) {
            const secondIdentifier = this.currentToken;
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

    if (this.currentToken.category === Category.RESERVED_WORD &&
      (this.currentToken.lexeme === ReservedWord.LOG)) {
      this.getNextToken();

      if (this.currentToken.category === Category.NEGATION_OPERATOR) {
        this.getNextToken();

        if (this.currentToken.category === Category.RESERVED_WORD &&
          (this.currentToken.lexeme === ReservedWord.FALSE || this.currentToken.lexeme === ReservedWord.TRUE)) {
          const valueOperator = this.currentToken;
          return new LogicExpression(valueOperator);
        } else {
          this.saveError(Message.NOT_FOUND_LOGIC_VALUE);
        }
      } else {

        if (this.currentToken.category === Category.RESERVED_WORD &&
          (this.currentToken.lexeme === ReservedWord.FALSE || this.currentToken.lexeme === ReservedWord.TRUE)) {
          const valueOperator = this.currentToken;
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

    return null;
  }

  /**
   * Verify is <Función> ::= function Identificador "(" <ListaParametros>? ")" ":" <TipoRetorno> <BloqueSentencias>
   *
   * @returns
   */
  private getFunction(): OurFunction {

    if (this.currentToken.category === Category.RESERVED_WORD && this.currentToken.lexeme === ReservedWord.FUNCTION) {
      this.getNextToken();

      if (this.currentToken.category === Category.IDENTIFIER) {

        const functionName = this.currentToken;

        this.getNextToken();

        if (this.currentToken.category === Category.LEFT_PARENTHESIS) {
          this.getNextToken();

          const params = this.getListParams();

          if (this.currentToken.category === Category.RIGHT_PARENTHESIS) {
            this.getNextToken();

            if (this.currentToken.category === Category.TWO_POINT_OPERATOR) {
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

  private getFunctionInvocation(): FunctionInvocation {
    return null;
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

    while (param != null && this.currentToken.category !== Category.RIGHT_PARENTHESIS) {

      listParams.push(param);

      if (this.currentToken.category === Category.COMMA_OPERATOR) {
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

    if (this.currentToken.category === Category.LESS_OPERATOR || this.currentToken.category === Category.PLUS_OPERATOR) {
      sign = this.currentToken;
      this.getNextToken();
    }
    if (this.currentToken.category === Category.INTEGER || this.currentToken.category === Category.DECIMAL ||
      this.currentToken.category === Category.IDENTIFIER) {
      const value = this.currentToken;
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

    if (this.currentToken.category === Category.IDENTIFIER) {
      const nameParam = this.currentToken;
      this.getNextToken();

      if (this.currentToken.category === Category.TWO_POINT_OPERATOR) {
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
    return null;
  }

  private getRead(): Read {
    return null;
  }

  private getReturn(): Return {
    return null;
  }

  /**
   * <TipoRetorno> ::= boolean | char | decimal | int | string | void
   *
   * @returns
   */
  private getReturnType(): Token {

    if (this.currentToken.category === Category.RESERVED_WORD) {

      if (this.currentToken.lexeme === ReservedWord.BOOLEAN || this.currentToken.lexeme === ReservedWord.CHAR ||
        this.currentToken.lexeme === ReservedWord.DECIMAL || this.currentToken.lexeme === ReservedWord.INT ||
        this.currentToken.lexeme === ReservedWord.STRING || this.currentToken.lexeme === ReservedWord.VOID) {
        return this.currentToken;
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

    return null;
  }

  /**
   * <BloqueSentencias> ::= "{" [<ListaSentencias>] "}"
   *
   * @returns
   */
  private getSentencesBlock(): Sentence[] {

    if (this.currentToken.category === Category.LEFT_BRACE) {
      this.getNextToken();

      const listSentences = this.getListSentences();

      if (this.currentToken.category === Category.RIGHT_BRACE) {
        this.getNextToken();

        return listSentences;
      } else {
        this.saveError(Message.NOT_FOUND_RIGHT_PARENTHESIS);
      }
    }

    return null;
  }

  private saveError(message: string): void {
    this.errors.push(new OurError(message, this.currentToken));
    console.trace()
  }
}
