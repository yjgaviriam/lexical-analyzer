/**
 * Symbol representation
 */
export class MySymbol {

  public name: string;
  public dataType: string;
  public modifiable: boolean;
  public ambit: string;
  public row: number;
  public column: number;
  public typeParams: string[];

  constructor(name: string, dataType: string, ambit: string, row: number, column: number, modifiable: boolean, typeParams?: string[]) {
    this.name = name;
    this.dataType = dataType;
    this.ambit = ambit;
    this.row = row;
    this.column = column;
    if (typeParams) {
      this.typeParams = typeParams;
    } else {
      this.modifiable = modifiable;
    }
  }

  public toString(): string {
    return `Simbolo(nombre=${this.name}, tipo=${this.dataType}, modificable=${this.modifiable},
      ${!this.typeParams ? `ambito=${this.ambit}, ` : ``}
      fila=${this.row}, columna=${this.column}
      ${this.typeParams ? `, tipoParametros=${this.typeParams}` : ``}
       )`;
  }
}
