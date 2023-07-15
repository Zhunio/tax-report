import { Payment, PaymentUpdateDto } from '@/app/api/models/payment.model';
import { ApiService } from '@/app/api/services/api.service';
import { Injectable, computed, signal } from '@angular/core';
import * as currency from 'currency.js';
import { compareAsc, parse } from 'date-fns';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { ReportService } from '../report/report.service';
import { UrlService } from '../url/url.service';

@Injectable()
export class PaymentService {
  constructor(
    private urlService: UrlService,
    private apiService: ApiService,
    private reportService: ReportService
  ) {
    this.reloadTaxReport().subscribe();
  }

  _payments = signal<Payment[]>([]);
  _sortedPayments = computed(() => this.sortPaymentsByDate(this._payments()));
  _mappedPayments = computed(() => this.mapPayments(this._sortedPayments()));
  payments = this._mappedPayments;

  reports = computed(() => this.reportService.calculateReport(this._mappedPayments()));

  _taxReportId = this.urlService.getUrlParam('taxReportId').pipe(
    filter(Boolean),
    map((taxReportId) => parseInt(taxReportId, 10))
  );

  reloadTaxReport() {
    return this._taxReportId.pipe(
      switchMap((taxReportId) =>
        this.apiService
          .getTaxReportById(taxReportId!)
          .pipe(tap(({ payments }) => this._payments.set(payments)))
      )
    );
  }

  updatePayment({ paymentId, update }: { paymentId: number; update: PaymentUpdateDto }) {
    return this._taxReportId.pipe(
      switchMap((taxReportId) =>
        this.apiService.updateTaxReportPayment(taxReportId!, paymentId, update)
      ),
      switchMap(() => this.reloadTaxReport())
    );
  }

  private sortPaymentsByDate(payments: Payment[]) {
    const sortedPayments = payments.sort((a, b) =>
      compareAsc(parse(a.date, 'MM/dd/yyyy', new Date()), parse(b.date, 'MM/dd/yyyy', new Date()))
    );

    return sortedPayments;
  }

  private mapPayments(payments: Payment[]): Array<Payment> {
    const mappedPayments = payments.map((payment) => {
      const price = () => {
        return payment.isExempt
          ? currency(payment.amount)
          : currency(payment.amount).divide(1.08125);
      };

      const tax = () => {
        return payment.isExempt ? currency(0) : price().multiply(0.08125);
      };

      const total = () => {
        return currency(payment.amount);
      };

      return {
        ...payment,
        price: price().toString(),
        tax: tax().toString(),
        total: total().toString(),
      };
    });

    return mappedPayments;
  }
}
