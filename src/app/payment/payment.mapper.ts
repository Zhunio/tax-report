import * as currency from 'currency.js';
import { PaymentDto } from '../shared/services/api/api.model';
import { Payment } from './payment.model';

export function calculatePriceTaxAndTotal(payment: PaymentDto): Payment {
  return {
    ...payment,
    price: calculatePrice(payment),
    tax: calculateTax(payment),
    total: calculateTotal(payment),
  };
}

function calculatePrice({ isExempt, amount }: PaymentDto) {
  const price = isExempt ? currency(amount) : currency(amount).divide(1.08125);
  return price.toString();
}

function calculateTax(payment: PaymentDto) {
  const tax = payment.isExempt ? currency(0) : currency(calculatePrice(payment)).multiply(0.08125);
  return tax.toString();
}

function calculateTotal({ amount }: PaymentDto) {
  return currency(amount).toString();
}
