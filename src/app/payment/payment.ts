import { ApiService } from '@/app/api.service';
import { Payment, PaymentUpdateDto } from '@/app/models/payment.model';
import { mapToPriceTaxAndTotal, sortPaymentsByDate } from '@/app/payment/array';
import { calculateReport } from '@/app/payment/report';
import { UrlService } from '@/app/payment/url';
import { Injectable, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, combineLatest, filter, map, startWith, switchMap, tap } from 'rxjs';

const TAX_REPORT_ID_PARAM = 'taxReportId';

@Injectable()
export class PaymentService {
  private api = inject(ApiService);
  private url = inject(UrlService);

  private taxReportIdFromUrl$ = this.url.getUrlParam(TAX_REPORT_ID_PARAM).pipe(
    filter(Boolean),
    map((taxReportId) => parseInt(taxReportId, 10))
  );

  private reloadTaxReportAction = new Subject<void>();

  private taxReport$ = combineLatest([
    this.taxReportIdFromUrl$,
    this.reloadTaxReportAction.pipe(startWith(undefined as void)),
  ]).pipe(switchMap(([taxReportId]) => this.api.getTaxReportById(taxReportId)));

  private taxReport = toSignal(this.taxReport$);

  payments = computed(() => {
    let payments: Payment[] = this.taxReport()?.payments ?? [];
    payments = payments.sort(sortPaymentsByDate);
    payments = payments.map(mapToPriceTaxAndTotal);

    return payments;
  });
  reports = computed(() => calculateReport(this.payments()));

  updatePaymentAction = new Subject<{ paymentId: number; update: PaymentUpdateDto }>();
  private updatePaymentEffect = toSignal(
    this.updatePaymentAction.pipe(
      filter(Boolean),
      switchMap(({ paymentId, update }) =>
        this.api
          .updateTaxReportPayment(this.taxReport()!.id, paymentId, update)
          .pipe(tap(() => this.reloadTaxReportAction.next()))
      )
    )
  );
}
