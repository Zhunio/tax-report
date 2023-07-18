import { Payment } from '@/app/api/models/payment.model';
import { Injectable } from '@angular/core';
import * as currency from 'currency.js';

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  calculatePrice({ isExempt, amount }: Payment) {
    const price = isExempt ? currency(amount) : currency(amount).divide(1.08125);
    return price.toString();
  }

  calculateTax(payment: Payment) {
    const tax = payment.isExempt
      ? currency(0)
      : currency(this.calculatePrice(payment)).multiply(0.08125);
    return tax.toString();
  }

  calculateTotal({ amount }: Payment) {
    return currency(amount).toString();
  }
}
