import { environment } from '@/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { PaymentUpdateDto, TaxReportDto, TaxReportCreateDto } from './api.model';

@Injectable()
export class ApiService {
  constructor(private readonly http: HttpClient) {}

  getTaxReportById(id: number) {
    return this.http.get<TaxReportDto>(`${environment.baseUrl}/tax-report/${id}`);
  }

  getTaxReports() {
    return this.http.get<TaxReportDto[]>(`${environment.baseUrl}/tax-report`);
  }

  createTaxReport({ fiscalQuarter, fiscalYear, uploadedFile }: TaxReportCreateDto) {
    const formData = new FormData();

    formData.append('fiscalQuarter', fiscalQuarter.toString());
    formData.append('fiscalYear', fiscalYear.toString());
    formData.append('file', uploadedFile);

    return this.http.post(`${environment.baseUrl}/tax-report`, formData);
  }

  updatePayment(taxReportId: number, paymentId: number, paymentUpdateDto: PaymentUpdateDto) {
    return this.http.patch<TaxReportDto>(
      `${environment.baseUrl}/tax-report/${taxReportId}/payment/${paymentId}`,
      paymentUpdateDto
    );
  }

  deleteTaxReport(taxReportId: number) {
    return this.http.delete<TaxReportDto>(`${environment.baseUrl}/tax-report/${taxReportId}`);
  }

  emailTaxReport(taxReportId: number) {
    return this.http.post<void>(`${environment.baseUrl}/tax-report/email/${taxReportId}`, {});
  }
}
