import * as currency from 'currency.js';
import { format, parse } from 'date-fns';
import { Payment, Report } from '../payment.model';

export function calculateReport(payments: Payment[]): Report[] {
  const groupedPaymentsByMonth = groupPaymentsByMonth(payments);

  const reports = [];
  for (const [month, payments] of groupedPaymentsByMonth) {
    const exemptPayments = payments.filter(({ isExempt }) => isExempt);

    const taxableSales = sumTotal(payments, 'price');
    const nonTaxableSales = sumTotal(exemptPayments, 'price');
    const netTaxableSales = currency(taxableSales).subtract(nonTaxableSales).toString();

    reports.push({ month, taxableSales, nonTaxableSales, netTaxableSales });
  }

  return reports;
}

function groupPaymentsByMonth(payments: Payment[]) {
  const monthToPayments = new Map<string, Payment[]>();

  for (const payment of payments) {
    const month = format(parse(payment.date, 'MM/dd/yyyy', new Date()), 'MMMM');
    const monthPayments = monthToPayments.get(month) ?? [];

    monthToPayments.set(month, [...monthPayments, payment]);
  }

  return monthToPayments;
}

export function sumTotal<T, K extends keyof T>(rows: T[], key: K) {
  return rows
    .map((row) => row[key])
    .reduce((acc, value) => currency(acc).add(value as string | number), currency(0))
    .toString();
}
