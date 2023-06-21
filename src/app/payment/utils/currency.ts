import { Payment } from '@/app/api/models/payment.model';
import * as currency from 'currency.js';

export function calculatePrice({ isExempt, amount }: Payment) {
  const price = isExempt ? currency(amount) : currency(amount).divide(1.08125);
  return price.toString();
}
export function calculateTax(payment: Payment) {
  const tax = payment.isExempt ? currency(0) : currency(calculatePrice(payment)).multiply(0.08125);
  return tax.toString();
}
export function calculateTotal(payment: Payment) {
  const price = calculatePrice(payment);
  const tax = calculateTax(payment);
  const total = currency(price).add(tax);

  return total.toString();
}
