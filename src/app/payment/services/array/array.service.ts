import { Payment } from '@/app/api/models/payment.model';
import { Injectable } from '@angular/core';
import * as currency from 'currency.js';
import { compareAsc, parse } from 'date-fns';
import { CurrencyService } from '../currency/currency.service';

@Injectable({ providedIn: 'root' })
export class ArrayService {
  constructor(private currencyService: CurrencyService) {}

  calculatePriceTaxAndTotal(payments: Payment[]): Payment[] {
    const mappedPayments = payments.map((payment) => {
      return {
        ...payment,
        price: this.currencyService.calculatePrice(payment),
        tax: this.currencyService.calculateTax(payment),
        total: this.currencyService.calculateTotal(payment),
      };
    });

    return mappedPayments;
  }

  sortPaymentsByDate(payments: Payment[]) {
    const sortedPayments = payments.sort((a, b) => {
      return compareAsc(
        parse(a.date, 'MM/dd/yyyy', new Date()),
        parse(b.date, 'MM/dd/yyyy', new Date())
      );
    });

    return sortedPayments;
  }

  sumTotal<T, K extends keyof T>(rows: T[], key: K) {
    return rows
      .map((row) => row[key])
      .reduce((acc, value) => currency(acc).add(value as string | number), currency(0))
      .toString();
  }
}
