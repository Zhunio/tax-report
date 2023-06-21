import { Payment, Report } from '@/app/api/models/payment.model';
import { sumTotal } from '@/app/payment/utils/array';
import { parseDate } from '@/app/payment/utils/date';
import * as currency from 'currency.js';
import { format } from 'date-fns';

export function calculateReport(payments: Payment[]): Report[] {
  const monthToPayments = new Map<string, Payment[]>();
  const reports = [];

  for (const payment of payments) {
    const month = format(parseDate(payment.date), 'MMMM');
    const monthPayments = monthToPayments.get(month) ?? [];

    monthToPayments.set(month, [...monthPayments, payment]);
  }

  for (const [month, payments] of monthToPayments) {
    const priceSum = sumTotal(payments, 'price');

    const taxSum = sumTotal(
      payments.filter(({ isExempt }) => isExempt),
      'price'
    );

    const netTaxableSales = currency(priceSum).subtract(taxSum).toString();

    const report = {
      month,
      taxableSales: priceSum,
      nonTaxableSales: taxSum,
      netTaxableSales,
    };
    reports.push(report);
  }

  return reports;
}
