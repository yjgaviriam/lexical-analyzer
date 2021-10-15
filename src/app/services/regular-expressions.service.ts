import { Injectable } from '@angular/core';

/**
 * Service to analyze string with regular expressions
 */
@Injectable({
  providedIn: 'root'
})
export class RegularExpressionsService {

  /**
   * Expression to validate if a string is a digit
   *
   * @param value String to validate
   *
   * @returns true if is a digit
   */
  public isDigit(value: string): boolean {
    return /^[0-9]+$/.test(value);
  }

  /**
   * Expression to validate if a string is a letter
   *
   * @param value String to validate
   *
   * @returns true if is a letter
   */
  public isLetter(value: string): boolean {
    return /^[A-Za-z]+$/.test(value);
  }
}
