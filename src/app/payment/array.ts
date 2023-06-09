import { Payment } from '@/app/models/payment.model';
import { calculatePrice, calculateTax, calculateTotal } from '@/app/payment/currency';
import { parseDate } from '@/app/payment/date';
import * as currency from 'currency.js';
import { compareAsc } from 'date-fns';

export function mapToPriceTaxAndTotal(
  payment: Payment
): Payment & { price: string; tax: string; total: string } {
  return {
    ...payment,
    price: calculatePrice(payment),
    tax: calculateTax(payment),
    total: calculateTotal(payment),
  };
}

export function sortPaymentsByDate(a: Payment, b: Payment) {
  return compareAsc(parseDate(a.date), parseDate(b.date));
}

export function sumTotal<T, K extends keyof T>(rows: T[], key: K) {
  return rows
    .map((row) => row[key])
    .reduce((acc, value) => currency(acc).add(value as string | number), currency(0))
    .toString();
}
