import { Pipe, PipeTransform } from '@angular/core';
import * as currency from 'currency.js';

@Pipe({ name: 'currency', standalone: true })
export class CurrencyPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return currency(value).format();
  }
}
