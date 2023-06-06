import { Payment, Report } from '@/app/models/payment.model';
import * as currency from 'currency.js';
import { compareAsc, format, parse } from 'date-fns';

function parseDate(date: string) {
  return parse(date, 'MM/dd/yyyy', new Date());
}

export function calculatePrice({ isExempt, amount }: Payment) {
  return isExempt ? currency(amount).toString() : currency(amount).divide(1.08125).toString();
}
export function calculateTax(payment: Payment) {
  return payment.isExempt
    ? currency(0).toString()
    : currency(calculatePrice(payment)).multiply(0.08125).toString();
}
export function calculateTotal(payment: Payment) {
  return currency(calculatePrice(payment)).add(calculateTax(payment)).toString();
}

export function calculatePriceTaxAndTotal(
  payments: Payment[]
): Array<Payment & { price: string; tax: string; total: string }> {
  return payments.map((payment) => ({
    ...payment,
    price: calculatePrice(payment),
    tax: calculateTax(payment),
    total: calculateTotal(payment),
  }));
}

export function sortPaymentsByDate(payments: Payment[]) {
  return payments.sort((a, b) => compareAsc(parseDate(a.date), parseDate(b.date)));
}

export function calculateReport(payments: Payment[]): Report[] {
  const monthToPayments = new Map<string, Payment[]>();
  const a = [];

  for (const payment of payments) {
    const month = format(parseDate(payment.date), 'MMMM');
    const monthPayments = monthToPayments.get(month) ?? [];

    monthToPayments.set(month, [...monthPayments, payment]);
  }

  for (const [month, payments] of monthToPayments) {
    const priceSum = sumPayments(payments, 'price');
    const exemptPayments = payments.filter(({ isExempt }) => isExempt);
    const taxSum = sumPayments(exemptPayments, 'price');
    const netTaxableSales = currency(priceSum).subtract(taxSum).format();

    a.push({ month, taxableSales: priceSum, nonTaxableSales: taxSum, netTaxableSales });
  }

  return a;
}

export function sumPayments(payments: Payment[], field: keyof Pick<Payment, 'price' | 'tax'>) {
  return payments.reduce((acc, payment) => currency(acc).add(payment[field]).format(), '0.00');
}
