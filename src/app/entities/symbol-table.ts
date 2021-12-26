import * as _ from 'lodash';
import { SemanticError } from './semantic-error';
import { MySymbol } from './symbol';

/**
 * SymbolTable representation
 */
export class SymbolTable {

  public listSymbols: MySymbol[];
  public listError: SemanticError[];

  constructor(listError: SemanticError[]) {
    this.listSymbols = [];
    this.listError = listError;
  }

  public saveSymbolValue(name: string, dataType: string, ambit: string, row: number, column: number, modifiable: boolean): void {

    const symbol = this.searchSymbolValue(name, ambit);
    if (!symbol) {
      this.listSymbols.push(new MySymbol(name, dataType, ambit, row, column, modifiable));
    } else {
      this.listError.push(new SemanticError(`El campo ${name} ya existe dentro del ambito ${ambit}`, row, column));
    }
  }

  public saveSymbolFunction(name: string, dataType: string, ambit: string, row: number, column: number, typeParams: string[]): void {
    const symbol = this.searchSymbolFunction(name, typeParams);
    if (!symbol) {
      this.listSymbols.push(new MySymbol(name, dataType, ambit, row, column, undefined, typeParams));
    } else {
      this.listError.push(new SemanticError(`La función ${name} ya existe dentro del ambito ${ambit}`, row, column));
    }
  }

  public searchSymbolValue(name: string, ambit: string): MySymbol {
    for (const symbol of this.listSymbols) {
      if (!symbol.typeParams) {
        if (symbol.name === name && symbol.ambit === ambit) {
          return symbol;
        }
      }
    }

    return null;
  }

  public searchSymbolFunction(name: string, typeParams: string[]): MySymbol {
    for (const symbol of this.listSymbols) {
      if (symbol.typeParams) {
        if (symbol.name === name && _.isEqual(symbol.typeParams.sort(), typeParams.sort())) {
          console.log(symbol.name, name, symbol.typeParams, typeParams);

          return symbol;
        }
      }
    }

    return null;
  }
}
