import { Injectable, signal } from '@angular/core';
import { map, switchMap, tap } from 'rxjs';

import { PaymentUpdateDto } from '../shared/services/api/api.model';
import { ApiService } from '../shared/services/api/api.service';
import { UrlService } from '../shared/services/url/url.service';
import { calculatePriceTaxAndTotal } from './payment.mapper';
import { Payment } from './payment.model';
import { byDate } from './payment.sort';

@Injectable()
export class PaymentService {
  constructor(private readonly apiService: ApiService, private readonly urlService: UrlService) {}

  _taxReportId$ = this.urlService
    .getUrlParam('taxReportId')
    .pipe(map((taxReportId) => parseInt(taxReportId!, 10)));

  payments = signal<Payment[]>([]);

  reloadTaxReport() {
    return this._taxReportId$.pipe(
      switchMap((taxReportId) =>
        this.apiService.getTaxReportById(taxReportId!).pipe(
          tap(({ payments }) => {
            payments = payments.sort(byDate);
            payments = payments.map(calculatePriceTaxAndTotal);

            this.payments.set(payments as Payment[]);
          })
        )
      )
    );
  }

  updatePayment({ paymentId, update }: { paymentId: number; update: PaymentUpdateDto }) {
    return this._taxReportId$.pipe(
      switchMap((taxReportId) => this.apiService.updatePayment(taxReportId!, paymentId, update)),
      switchMap(() => this.reloadTaxReport())
    );
  }
}
