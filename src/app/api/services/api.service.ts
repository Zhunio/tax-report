import { TaxReport, TaxReportCreate } from '@/app/api/models/tax-report.model';
import { PaymentUpdateDto } from '@/app/api/models/payment.model';
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

  createTaxReport({ fiscalQuarter, fiscalYear, uploadedFile }: TaxReportCreate) {
    const formData = new FormData();

    formData.append('fiscalQuarter', fiscalQuarter.toString());
    formData.append('fiscalYear', fiscalYear.toString());
    formData.append('file', uploadedFile);

    return this.http.post(`${environment.baseUrl}/tax-report`, formData);
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

  deleteTaxReport(taxReportId: number) {
    return this.http.delete(`${environment.baseUrl}/tax-report/${taxReportId}`);
  }
}
