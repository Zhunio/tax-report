import { Payment, PaymentUpdateDto } from '@/app/api/models/payment.model';
import { ApiService } from '@/app/api/services/api.service';
import { Injectable, computed, signal } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { ArrayService } from '../array/array.service';
import { ReportService } from '../report/report.service';
import { UrlService } from '../url/url.service';

@Injectable()
export class PaymentService {
  constructor(
    private urlService: UrlService,
    private apiService: ApiService,
    private arrayService: ArrayService,
    private reportService: ReportService
  ) {
    this.reloadTaxReport().subscribe();
  }

  _taxReportId$ = this.urlService
    .getUrlParam('taxReportId')
    .pipe(map((taxReportId) => parseInt(taxReportId!, 10)));

  _payments = signal<Payment[]>([]);
  _sortedPayments = computed(() => {
    return this.arrayService.sortPaymentsByDate(this._payments());
  });
  _mappedPayments = computed(() => {
    return this.arrayService.calculatePriceTaxAndTotal(this._sortedPayments());
  });
  payments = this._mappedPayments;

  reports = computed(() => this.reportService.calculateReport(this._mappedPayments()));

  reloadTaxReport() {
    return this._taxReportId$.pipe(
      switchMap((taxReportId) =>
        this.apiService
          .getTaxReportById(taxReportId!)
          .pipe(tap(({ payments }) => this._payments.set(payments)))
      )
    );
  }

  updatePayment({ paymentId, update }: { paymentId: number; update: PaymentUpdateDto }) {
    return this._taxReportId$.pipe(
      switchMap((taxReportId) =>
        this.apiService.updateTaxReportPayment(taxReportId!, paymentId, update)
      ),
      switchMap(() => this.reloadTaxReport())
    );
  }
}
