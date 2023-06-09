import { TaxReport } from '@/app/models';
import { PaymentUpdateDto } from '@/app/models/payment.model';
import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ApiService {
  http = inject(HttpClient);

  getTaxReportById(id: number) {
    return this.http.get<TaxReport>(`${environment.baseUrl}/tax-report/${id}`);
  }

  getTaxReports() {
    return this.http.get<TaxReport[]>(`${environment.baseUrl}/tax-report`);
  }

  updateTaxReportPayment(
    taxReportId: number,
    paymentId: number,
    paymentUpdateDto: PaymentUpdateDto
  ) {
    return this.http.patch(
      `${environment.baseUrl}/tax-report/${taxReportId}/payment/${paymentId}`,
      paymentUpdateDto
    );
  }
}
