import { Payment, Report } from '@/app/api/models/payment.model';
import { ArrayService } from '@/app/payment/services/array/array.service';
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import * as currency from 'currency.js';
import { format, parse } from 'date-fns';

@Injectable()
export class ReportService extends ComponentStore<{}> {
  constructor(private arrayService: ArrayService) {
    super({});
  }

  calculateReport(payments: Payment[]): Report[] {
    const reports = [];
    const groupedPaymentsByMonth = this.groupPaymentsByMonth(payments);

    for (const [month, payments] of groupedPaymentsByMonth) {
      const exemptPayments = payments.filter(({ isExempt }) => isExempt);

      const taxableSales = this.arrayService.sumTotal(payments, 'price');
      const nonTaxableSales = this.arrayService.sumTotal(exemptPayments, 'price');
      const netTaxableSales = currency(taxableSales).subtract(nonTaxableSales).toString();

      reports.push({ month, taxableSales, nonTaxableSales, netTaxableSales });
    }

    return reports;
  }

  private groupPaymentsByMonth(payments: Payment[]) {
    const monthToPayments = new Map<string, Payment[]>();

    for (const payment of payments) {
      const month = format(parse(payment.date, 'MM/dd/yyyy', new Date()), 'MMMM');
      const monthPayments = monthToPayments.get(month) ?? [];

      monthToPayments.set(month, [...monthPayments, payment]);
    }

    return monthToPayments;
  }
}
